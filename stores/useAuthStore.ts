import { create } from "zustand";

import { loginInputSchema } from "../schemas/authSchema";
import type { User } from "../types/User";

type AuthState = {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  login: async (email, password) => {
    const parsed = loginInputSchema.parse({ email, password });
    set({
      currentUser: { id: parsed.email, email: parsed.email },
      isAuthenticated: true,
    });
  },
  logout: () => set({ currentUser: null, isAuthenticated: false }),
}));
