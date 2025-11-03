/// <reference lib="deno.unstable" />
import { getCookies } from "https://deno.land/std/http/cookie.ts";

/**
 * Authentication utilities for Deno KV-based session management
 * Handles user authentication, token validation, and session storage
 */

/**
 * User data structure stored in KV
 */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}



/**
 * Authentication configuration
 */
export interface AuthConfig {
  kv: Deno.Kv;
  cookieDomain: string;
  isProduction: boolean;
}

/**
 * Creates and initializes the authentication system
 * @param config - Authentication configuration
 * @returns Authentication utilities object
 */
export function createAuth(config: AuthConfig) {
  const { kv, cookieDomain, isProduction } = config;



  /**
   * Sets an HTTP-only secure cookie
   * @param headers - Headers object to set cookie on
   * @param name - Cookie name
   * @param value - Cookie value
   * @param options - Cookie options
   */
  function setCookie(
    headers: Headers,
    name: string,
    value: string,
    options: {
      expires?: Date;
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: "Strict" | "Lax" | "None";
      domain?: string;
      path?: string;
    } = {}
  ): void {
    const {
      expires,
      httpOnly = true,
      secure = isProduction,
      sameSite = "Lax",
      domain = cookieDomain,
      path = "/"
    } = options;

    let cookieString = `${name}=${value}`;
    
    if (expires) {
      cookieString += `; expires=${expires.toUTCString()}`;
    }
    
    if (httpOnly) {
      cookieString += "; HttpOnly";
    }
    
    if (secure) {
      cookieString += "; Secure";
    }
    
    if (sameSite) {
      cookieString += `; SameSite=${sameSite}`;
    }
    
    // Only set domain if specified (allows cross-domain cookies for proxy)
    if (domain) {
      cookieString += `; Domain=${domain}`;
    }
    
    if (path) {
      cookieString += `; Path=${path}`;
    }

    headers.append("Set-Cookie", cookieString);
  }

  /**
   * Gets cookie value from request headers using Deno std library
   * @param headers - Request headers
   * @param name - Cookie name
   * @returns Cookie value or null
   */
  function getCookie(headers: Headers, name: string): string | null {
    try {
      const cookies = getCookies(headers);
      return cookies[name] || null;
    } catch {
      return null;
    }
  }



  /**
   * Gets user by ID from KV
   * @param userId - User ID
   * @returns User data or null
   */
  async function getUserById(userId: string): Promise<User | null> {
    try {
      const result = await kv.get(["user", userId]);
      return result.value as User | null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  }

  /**
   * Stores user data in KV
   * @param user - User data to store
   */
  async function storeUser(user: User): Promise<void> {
    try {
      await kv.set(["user", user.id], user);
    } catch (error) {
      console.error("Error storing user:", error);
      throw error;
    }
  }

  /**
   * Deletes a session (logout)
   * @param token - Session token to delete
   */
  async function deleteSession(token: string): Promise<void> {
    try {
      await kv.delete(["session", token]);
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  }



  /**
    * Middleware to protect routes requiring authentication
    * @param request - Incoming request
    * @returns Authenticated user or null
    */
  async function requireAuth(request: Request): Promise<User | null> {
    const userId = getCookie(request.headers, "id");
    
    if (!userId) {
      return null;
    }

    // Get user directly by ID from the id cookie
    let user = await getUserById(userId);
    
    // If user doesn't exist in KV, create a basic user from the ID
    if (!user) {
      const newUser: User = {
        id: userId,
        name: `User ${userId.substring(0, 8)}`,
        email: `${userId.substring(0, 8)}@example.com`,
        createdAt: new Date()
      };
      await storeUser(newUser);
      user = newUser;
    }
    
    return user;
  }



  /**
   * Handles logout by clearing auth cookie
   * @param request - Logout request
   * @returns Response with cleared cookie
   */
  async function handleLogout(request: Request): Promise<Response> {
    const userId = getCookie(request.headers, "id");
    
    if (userId) {
      await deleteSession(userId);
    }

    const headers = new Headers();
    setCookie(headers, "id", "", {
      expires: new Date(0) // Set to past date to delete cookie
    });

    headers.set("Location", "/");
    return new Response(null, { status: 302, headers });
  }

  return {
    // Core functions
    getUserById,
    storeUser,
    deleteSession,
    
    // Request/response helpers
    getCookie,
    setCookie,
    requireAuth,
    
    // Flow handlers
    handleLogout,
    
    // Configuration
    config
  };
}

/**
 * In-memory KV fallback for environments without Deno KV
 */
class InMemoryKV {
  private store = new Map<string, any>();

  async get(key: string[]): Promise<{ value: any }> {
    const keyStr = JSON.stringify(key);
    return { value: this.store.get(keyStr) || null };
  }

  async set(key: string[], value: any, options?: { expireIn?: number }): Promise<void> {
    const keyStr = JSON.stringify(key);
    this.store.set(keyStr, value);
    
    if (options?.expireIn) {
      setTimeout(() => {
        this.store.delete(keyStr);
      }, options.expireIn);
    }
  }

  async delete(key: string[]): Promise<void> {
    const keyStr = JSON.stringify(key);
    this.store.delete(keyStr);
  }
}

/**
 * Default authentication configuration
 */
export async function getDefaultConfig(requestHost?: string): Promise<AuthConfig> {
  const isProduction = Deno.env.get("DENO_ENV") === "production";
  
  // Use in-memory KV if Deno.openKv is not available
  let kv: Deno.Kv;
  try {
    kv = await Deno.openKv();
  } catch {
    kv = new InMemoryKV() as any;
  }
  
  // Cookie domain from environment or fallback to request host
  const cookieDomain = Deno.env.get("COOKIE_DOMAIN") || "";
  
  return {
    kv,
    cookieDomain,
    isProduction
  };
}