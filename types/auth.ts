export type UserType = "scholar" | "admin" | "supervisor";

export interface BackendUser {
  id: string | number;
  email: string;
  name?: string;
  userType: UserType;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
