import type { User } from "@/types/user";
import { seedUsers } from "./seed";

const users: User[] = [...seedUsers];

export function getAllUsers(): User[] {
  return [...users];
}

export function getUsersByRole(role: "analyst" | "manager"): User[] {
  return users.filter((u) => u.role === role);
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}
