import { ExtractedParams } from "@/types";
import { useParams, useSearchParams } from "next/navigation";
export const generateId = () => crypto.randomUUID();
export type UserData = {
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string | null;
    role: string;
    status: string;
    gender: string;
    country: string;
    isEmailVerified: boolean;
    isSubscribed: boolean;
    subscriptionStartDate: string | null;
    subscriptionEndDate: string | null;
    subscriptionType: string | null;
    automaticSubscriptionRenewal: boolean;
    avatar: string | null;
    goals: Array<Record<string, any>>;
    subjects: Array<Record<string, any>>;
    createdAt: string;
    updatedAt: string;
    [key: string]: any;
  };
  token: string;
};

/**
 * Retrieves the full user object from sessionStorage
 */
export function getUser(): UserData | null {
  try {
     if (typeof window === "undefined") {
      // server-side, no sessionStorage
      return null;
    }
    
    const userStr = sessionStorage.getItem("user");
    return userStr ? (JSON.parse(userStr) as UserData) : null;
  } catch (err) {
    console.error("Error parsing user from sessionStorage:", err);
    return null;
  }
}


export function getUserField<T = unknown>(field: string): T | null {
  try {
     if (typeof window === "undefined") {
      // server-side, no sessionStorage
      return null;
    }

    const userStr = sessionStorage.getItem("user");
    if (!userStr) return null;

    const parsed = JSON.parse(userStr) as { user?: Record<string, any> };
    return parsed?.user?.[field] ?? null;
  } catch (err) {
    console.error(`Error getting "${field}" from sessionStorage:`, err);
    return null;
  }
}

/**
 * Retrieves a specific property from user or token based on key
 * @param key - e.g., "id", "email", "fullName", "token"
 */
export function getUserProperty<T = any>(key: string): T | null {
  const data = getUser();
  if (!data) return null;

  if (key === "token") return data.token as T;

  // For user fields inside user.user
  return key in data.user ? (data.user[key] as T) : null;
}


// utils/generatePassword.ts

/**
 * Generate a strong random password (7–10 characters).
 * Includes uppercase, lowercase, numbers, and symbols.
 */
export function generatePassword(): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+[]{}<>?";
  const allChars = upper + lower + numbers + symbols;

  // Ensure password length between 7 and 10
  const length = Math.floor(Math.random() * (10 - 7 + 1)) + 7;

  let password = "";
  // Guarantee at least one char from each category
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest with random chars
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle to avoid predictable order
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}


export function hasAccess(userRole: string | null | undefined, allowedRoles: string[] = ["ADMIN", "SUPER_ADMIN"]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole.toUpperCase());
}


export function getUrlParams(): ExtractedParams {
  const params = useParams();
  const searchParams = useSearchParams();

  const getValue = (key: string): string | null => {
    const val = params?.[key] || searchParams?.get(key);
    if (!val) return null;
    return Array.isArray(val) ? val[0] : val;
  };

  return {
    section: getValue("section"),
    mod: getValue("mod"),
    id: getValue("id"),
    action: getValue("action"),
    itemId: getValue("itemId"),
  };
}