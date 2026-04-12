import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Promotion {
  id: string;
  name: string;
  type: 'percentage' | 'fixed_amount' | 'buy_one_get_one';
  value: number;
  startDate: string;
  endDate: string;
  applicableProducts: string[]; // Product IDs or 'all'
  applicableCategories: string[];
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  code?: string; // For coupon codes
  isActive: boolean;
  bannerImage?: string;
  bannerText?: string;
  displayOnHomepage: boolean;
  createdAt: string;
}

interface PromotionsStore {
  promotions: Promotion[];
  activePromotions: () => Promotion[];
  getPromotionById: (id: string) => Promotion | undefined;
  getHomepageBanners: () => Promotion[];
  
  // Admin actions
  createPromotion: (promotion: Omit<Promotion, 'id' | 'usageCount' | 'createdAt'>) => Promise<void>;
  updatePromotion: (id: string, updates: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;
  togglePromotion: (id: string) => void;
  incrementUsage: (id: string) => void;
  validatePromoCode: (code: string, cartTotal: number) => Promotion | null;
}

export const usePromotionsStore = create<PromotionsStore>()(
  persist(
    (set, get) => ({
      promotions: [],

      activePromotions: () => {
        const now = new Date().toISOString();
        return get().promotions.filter(
          (p) =>
            p.isActive &&
            p.startDate <= now &&
            p.endDate >= now &&
            (!p.usageLimit || p.usageCount < p.usageLimit)
        );
      },

      getPromotionById: (id) => get().promotions.find((p) => p.id === id),
      
      getHomepageBanners: () => {
        const now = new Date().toISOString();
        return get().promotions.filter(
          (p) =>
            p.displayOnHomepage &&
            p.isActive &&
            p.startDate <= now &&
            p.endDate >= now
        );
      },

      createPromotion: async (promotionData) => {
        const newPromotion: Promotion = {
          ...promotionData,
          id: Date.now().toString(),
          usageCount: 0,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          promotions: [...state.promotions, newPromotion],
        }));
      },

      updatePromotion: (id, updates) => {
        set((state) => ({
          promotions: state.promotions.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      deletePromotion: (id) => {
        set((state) => ({
          promotions: state.promotions.filter((p) => p.id !== id),
        }));
      },

      togglePromotion: (id) => {
        set((state) => ({
          promotions: state.promotions.map((p) =>
            p.id === id ? { ...p, isActive: !p.isActive } : p
          ),
        }));
      },

      incrementUsage: (id) => {
        set((state) => ({
          promotions: state.promotions.map((p) =>
            p.id === id ? { ...p, usageCount: p.usageCount + 1 } : p
          ),
        }));
      },

      validatePromoCode: (code, cartTotal) => {
        const promotion = get().promotions.find(
          (p) =>
            p.code?.toLowerCase() === code.toLowerCase() &&
            p.isActive &&
            (!p.minPurchase || cartTotal >= p.minPurchase)
        );
        return promotion || null;
      },
    }),
    {
      name: 'fittrust-promotions',
    }
  )
);