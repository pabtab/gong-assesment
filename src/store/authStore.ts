import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

interface UserInfo {
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  setAuth: (user: UserInfo) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        setAuth: (user) => set({ user, isAuthenticated: true }),
        clearAuth: () => set({ user: null, isAuthenticated: false }),
      }),
      {
        name: "auth-storage",
      }
    )
  )
);
