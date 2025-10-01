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

  const logout = () => {
    signOut();
    clearAuth();
    navigate("/");
  };

  const login = (userData: { email: string; firstName: string; lastName: string }) => {
    setAuth(userData);
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
}
