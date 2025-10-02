import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { signOut } from "../services/firebase";

/**
 * Custom hook that encapsulates authentication logic
 * Separates business logic from UI components
 * Makes components more testable and reusable
 */
export function useAuth() {
  const navigate = useNavigate();
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  // Memoize logout to prevent unnecessary re-renders of components that receive it as prop
  const logout = useCallback(() => {
    signOut();
    clearAuth();
    navigate("/");
  }, [clearAuth, navigate]);

  // Memoize login to maintain referential equality
  const login = useCallback(
    (userData: { email: string; firstName: string; lastName: string }) => {
      setAuth(userData);
    },
    [setAuth]
  );

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
}
