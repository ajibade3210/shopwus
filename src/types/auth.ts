import type { ReactNode } from "react";

// API DTO shapes (response contracts from the Shopwus API)
export interface UserDto {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  role: string;
  avatarUrl?: string | null;
}

export interface BusinessDto {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string | null;
}

export interface AuthResponseDto {
  user: UserDto;
  business?: BusinessDto | null;
  studio?: BusinessDto | null;
  accessToken?: string;
  refreshToken?: string;
  token?: string;
}

export interface MeResponseDto {
  user: UserDto;
  business?: BusinessDto | null;
  isStudioOwner?: boolean;
  permissions?: string[];
}

// User and authentication types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: "admin" | "user";
}

export interface AuthSession {
  user: User;
  expiresAt: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  studioName?: string;
  studioSlug?: string;
  avatarUrl?: string;
}

export interface AuthHeaderProps {
  rightAction?: ReactNode;
  mode?: "login" | "signup";
  claimSlug?: string;
}

export interface DecodedJwtPayload {
  userId?: string;
  id?: string;
  email?: string;
  role?: string;
  businessId?: string;
  jti?: string;
  iat?: number;
  exp?: number;
}

export interface DecodedJwtHeader {
  alg?: string;
  typ?: string;
}
