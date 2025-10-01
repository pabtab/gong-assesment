import type { User, UserNode } from "../types";

/**
 * Builds a tree structure from flat user array based on managerId
 * @param users - Flat array of users
 * @returns Array of root-level users with nested children
 */
export function buildHierarchy(users: User[]): UserNode[] {
  const userMap = new Map<number, UserNode>();
  const roots: UserNode[] = [];

  // Initialize the structure of the tree
  users.forEach((user) => {
    userMap.set(user.id, { ...user, children: [] });
  });

  users.forEach((user) => {
    const node = userMap.get(user.id)!;

    if (!user.managerId || user.managerId === undefined) {
      // No manager = root level
      roots.push(node);
    } else {
      const parent = userMap.get(user.managerId);
      if (parent) {
        parent.children.push(node);
      } else {
        // If parent not found, treat as root
        roots.push(node);
      }
    }
  });

  return roots;
}
