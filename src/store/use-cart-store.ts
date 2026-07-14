import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  imageUrl: string;
  variant?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  // Ações do Carrinho
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // Controle da UI (Sidebar)
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Cálculos Computados
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          // Verifica se o item com a mesma variante já existe
          const existingItemIndex = state.items.findIndex(
            (i) => i.productId === newItem.productId && i.variant === newItem.variant
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems, isOpen: true }; // Abre o carrinho ao adicionar
          }

          // Gera um ID único para a linha do carrinho
          const cartItemId = `${newItem.productId}-${newItem.variant || 'default'}`;
          return { 
            items: [...state.items, { ...newItem, id: cartItemId }],
            isOpen: true 
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'trendrush-cart-storage', // Nome da key no localStorage
      partialize: (state) => ({ items: state.items }), // Persiste apenas os itens, não o estado de abertura (isOpen)
    }
  )
);