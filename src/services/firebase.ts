import type { User, FirebaseData } from "../types";

const FIREBASE_DATABASE_URL = "https://gongfetest.firebaseio.com";

async function fetchAllData(): Promise<FirebaseData> {
  const url = `${FIREBASE_DATABASE_URL}/.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch data from Firebase");
  }

  return response.json();
}

export async function validateUser(secret: string): Promise<User> {
  const data = await fetchAllData();

  const userId = data.secrets[secret];

  if (!userId) {
    throw new Error("Invalid credentials");
  }

  const user = data.users.find((u) => u.id === userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

/**
 * Validates user and returns both the user and all users data
 * This allows us to populate the React Query cache in one request
 * @param secret - Encoded credentials
 * @returns Object containing authenticated user and all users
 */
export async function validateUserAndFetchAll(secret: string): Promise<{ user: User; users: User[] }> {
  const data = await fetchAllData();

  const userId = data.secrets[secret];

  if (!userId) {
    throw new Error("Invalid credentials");
  }

  const user = data.users.find((u) => u.id === userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    user,
    users: data.users,
  };
}

export async function fetchUsers(): Promise<User[]> {
  const data = await fetchAllData();
  return data.users;
}

export function signOut(): void {
  localStorage.removeItem("auth-storage");
}
