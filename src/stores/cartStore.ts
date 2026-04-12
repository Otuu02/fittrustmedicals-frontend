import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  maxStock: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemCount: (productId: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const existingItem = get().items.find((i) => i.productId === item.productId);
        
        if (existingItem) {
          const newQuantity = Math.min(existingItem.quantity + item.quantity, existingItem.maxStock);
          set((state) => ({
            items: state.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: newQuantity }
                : i
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...item, id: Date.now().toString() }],
          }));
        }
        
        // Auto-open cart when adding item
        set({ isOpen: true });
      },

      removeItem: (productId) => {
        console.log('Removing item:', productId);
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        console.log('Updating quantity:', { productId, quantity });
        
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        const item = get().items.find((i) => i.productId === productId);
        if (item) {
          const maxQuantity = item.maxStock || 99;
          const newQuantity = Math.min(quantity, maxQuantity);
          
          set((state) => ({
            items: state.items.map((i) =>
              i.productId === productId ? { ...i, quantity: newQuantity } : i
            ),
          }));
        }
      },

      clearCart: () => {
        console.log('Clearing cart');
        set({ items: [] });
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        return item?.quantity || 0;
      },
    }),
    {
      name: 'fittrust-cart',
    }
  )
);