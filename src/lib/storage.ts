// src/lib/storage.ts
export class StorageManager {
  private static readonly PREFIX = 'ftm_';

  static set<T>(key: string, value: T, expirationMinutes?: number): void {
    if (typeof window === 'undefined') return;

    const fullKey = this.PREFIX + key;
    const data = {
      value,
      timestamp: Date.now(),
      expirationMinutes,
    };

    try {
      localStorage.setItem(fullKey, JSON.stringify(data));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  }

  static get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    const fullKey = this.PREFIX + key;

    try {
      const item = localStorage.getItem(fullKey);
      if (!item) return null;

      const data = JSON.parse(item);

      // Check expiration
      if (data.expirationMinutes) {
        const now = Date.now();
        const elapsedMinutes = (now - data.timestamp) / (1000 * 60);

        if (elapsedMinutes > data.expirationMinutes) {
          localStorage.removeItem(fullKey);
          return null;
        }
      }

      return data.value as T;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  }

  static remove(key: string): void {
    if (typeof window === 'undefined') return;

    const fullKey = this.PREFIX + key;
    try {
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  }

  static clear(): void {
    if (typeof window === 'undefined') return;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }

  static exists(key: string): boolean {
    if (typeof window === 'undefined') return false;

    const fullKey = this.PREFIX + key;
    return localStorage.getItem(fullKey) !== null;
  }
}

export default StorageManager;