import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../services/firebase";

/**
 * Custom hook for fetching users data with React Query
 * Encapsulates the query logic for users
 * Automatically uses cached data if available (populated by login mutation)
 * @returns Query object with users data, loading, and error states
 */
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });
}
