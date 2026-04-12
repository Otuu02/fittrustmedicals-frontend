// src/lib/auth.ts

// Simple JWT decoder - no external package required
function jwtDecode<T>(token: string): T {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    throw new Error('Invalid token');
  }
}

interface DecodedToken {
  sub: string;
  email: string;
  role: 'customer' | 'staff' | 'admin';
  iat: number;
  exp: number;
}

export class AuthManager {
  private static readonly TOKEN_KEY = 'authToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';

  static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }

  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;
    return Date.now() >= decoded.exp * 1000;
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  static getUserRole(): 'customer' | 'staff' | 'admin' | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded = this.decodeToken(token);
    return decoded?.role || null;
  }

  static getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded = this.decodeToken(token);
    return decoded?.sub || null;
  }

  static getUserEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded = this.decodeToken(token);
    return decoded?.email || null;
  }

  static hasRole(role: string | string[]): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false;

    if (Array.isArray(role)) {
      return role.includes(userRole);
    }

    return userRole === role;
  }

  static can(permission: string): boolean {
    const role = this.getUserRole();
    const permissions: Record<string, string[]> = {
      admin: ['*'],
      staff: ['view_orders', 'view_products', 'manage_referrals'],
      customer: ['view_orders', 'view_products'],
    };

    if (!role) return false;
    if (permissions[role]?.includes('*')) return true;
    return permissions[role]?.includes(permission) || false;
  }
}

export default AuthManager;