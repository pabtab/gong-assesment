export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  photo?: string;
  managerId?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserNode extends User {
  children: UserNode[];
}

export interface FirebaseData {
  secrets: Record<string, number>; // secret -> userId mapping
  users: User[];
}
