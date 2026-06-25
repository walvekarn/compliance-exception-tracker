/**
 * User entity (compliance analyst / manager)
 */

export const USER_ROLES = ["analyst", "manager"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
