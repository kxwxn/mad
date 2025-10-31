import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { WishlistItem } from '@/types/wishlist.types';

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  toggleWishlist: (item: WishlistItem) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === newItem.id);
          if (existingItem) {
            return state;
          }
          return { items: [...state.items, newItem] };
        });
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }));
      },
      
      isInWishlist: (id) => {
        return get().items.some(item => item.id === id);
      },
      
      clearWishlist: () => {
        set({ items: [] });
      },
      
      toggleWishlist: (item) => {
        const isInList = get().isInWishlist(item.id);
        if (isInList) {
          get().removeItem(item.id);
        } else {
          get().addItem(item);
        }
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
); 