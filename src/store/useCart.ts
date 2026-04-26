import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number; // Stored as a raw number for calculation
  displayPrice: string; // e.g., "$280"
  quantity: number;
  imageUrl: string;
  options?: string[];
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getDeliveryCharges: () => number;
  getDiscount: () => number;
  getCartTotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);
        
        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
            isOpen: true, // Auto open cart on add
          });
        } else {
          set({ items: [...currentItems, item], isOpen: true });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },
      clearCart: () => set({ items: [] }),
      getCartSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getDeliveryCharges: () => {
        const totalQuantity = get().items.reduce((total, item) => total + item.quantity, 0);
        if (totalQuantity === 0) return 0;
        return totalQuantity === 1 ? 250 : 0;
      },
      getDiscount: () => {
        const totalQuantity = get().items.reduce((total, item) => total + item.quantity, 0);
        if (totalQuantity >= 3) {
          return get().getCartSubtotal() * 0.10;
        }
        return 0;
      },
      getCartTotal: () => {
        return get().getCartSubtotal() + get().getDeliveryCharges() - get().getDiscount();
      },
    }),
    {
      name: 'seyal-imperial-cart',
      onRehydrateStorage: () => (state) => {
        // Clear out old testing data with invalid Mongo ObjectIds
        if (state && state.items) {
          const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);
          const validItems = state.items.filter((item) => isValidObjectId(item.id));
          if (validItems.length !== state.items.length) {
            state.items = validItems;
          }
        }
      },
    }
  )
);
