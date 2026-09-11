import { UserRole } from './role.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedUser {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
}
