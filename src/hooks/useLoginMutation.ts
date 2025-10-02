import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { validateUserAndFetchAll } from "../services/firebase";
import { encode } from "../utils/encode";
import { useAuth } from "./useAuth";

/**
 * Custom hook for login mutation with cache population
 * Encapsulates the login logic and React Query integration
 * @returns Mutation object with login functionality
 */
export function useLoginMutation() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const secret = encode(email, password);
      return validateUserAndFetchAll(secret);
    },
    onSuccess: (data) => {
      // 1. Authenticate the user
      login({
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
      });

      // 2. Populate React Query cache with users data
      // This prevents the Hierarchy page from making another API call
      queryClient.setQueryData(["users"], data.users);

      // 3. Navigate to hierarchy page
      navigate("/hierarchy");
    },
  });
}
