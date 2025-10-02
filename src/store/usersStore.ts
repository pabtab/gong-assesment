import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { buildHierarchy, removeNode } from "../utils/hierarchy";
import type { User, UserNode } from "../types";

interface UsersState {
  users: User[] | [];
  hierarchy: UserNode[];
  setUsers: (users: User[]) => void;
  removeUser: (user: UserNode) => void;
  setHierarchy: () => void;
}

export const useUsersStore = create<UsersState>()(
  devtools(
    persist(
      (set, get) => ({
        users: [],
        hierarchy: [],
        setUsers: (users: User[]) => set({ users }),
        setHierarchy: () => set({ hierarchy: buildHierarchy(get().users) }),
        removeUser: (user: UserNode) =>
          set({
            hierarchy: buildHierarchy(removeNode(get().users, user)),
            users: removeNode(get().users, user),
          }),
      }),
      {
        name: "users-storage",
      }
    )
  )
);
