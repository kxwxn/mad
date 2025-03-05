import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  selectedSize: string;
  selectedColor?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, selectedSize: string) => void;
  updateQuantity: (id: string, selectedSize: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => {
        set((state) => {
          // 이미 장바구니에 있는 상품인지 확인
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === newItem.id && item.selectedSize === newItem.selectedSize
          );
          
          if (existingItemIndex >= 0) {
            // 이미 있는 상품이면 수량만 증가
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          } else {
            // 새 상품이면 추가
            return { items: [...state.items, newItem] };
          }
        });
      },
      
      removeItem: (id, selectedSize) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === id && item.selectedSize === selectedSize)
          ),
        }));
      },
      
      updateQuantity: (id, selectedSize, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.selectedSize === selectedSize
              ? { ...item, quantity }
              : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage', // localStorage에 저장될 키 이름
    }
  )
);