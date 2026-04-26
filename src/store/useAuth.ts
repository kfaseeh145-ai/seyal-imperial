import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCart } from './useCart';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  token?: string;
}

interface AuthStore {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isInitialized: false,
      login: (userData) => {
        useCart.getState().clearCart();
        set({ user: userData, isAuthenticated: true });
      },
      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
        useCart.getState().clearCart();
      },
    }),
    {
      name: 'seyal-imperial-auth',
      onRehydrateStorage: () => (state) => {
        if (state) state.isInitialized = true;
      },
    }
  )
);

