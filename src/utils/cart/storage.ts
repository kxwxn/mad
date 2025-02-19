import { CartItem } from './types';

const CART_STORAGE_KEY = 'shopping-cart';

export const cartStorage = {
  getItems: (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const items = localStorage.getItem(CART_STORAGE_KEY);
    return items ? JSON.parse(items) : [];
  },

  addItem: (item: CartItem) => {
    const items = cartStorage.getItems();
    const existingItemIndex = items.findIndex(
      i => i.id === item.id && i.selectedSize === item.selectedSize
    );

    if (existingItemIndex > -1) {
      items[existingItemIndex].quantity += 1;
    } else {
      items.push(item);
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    return items;
  },

  removeItem: (id: string, selectedSize: string) => {
    const items = cartStorage.getItems().filter(
      item => !(item.id === id && item.selectedSize === selectedSize)
    );
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    return items;
  },

  updateQuantity: (id: string, selectedSize: string, quantity: number) => {
    const items = cartStorage.getItems();
    const itemIndex = items.findIndex(
      item => item.id === id && item.selectedSize === selectedSize
    );

    if (itemIndex > -1) {
      items[itemIndex].quantity = quantity;
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
    return items;
  },

  clearCart: () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
};