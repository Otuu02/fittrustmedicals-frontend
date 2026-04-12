import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getPlaceholderImage } from '@/lib/image-utils';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  specifications: Record<string, string>;
  image: string;
  gallery?: string[];
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  isPromotional?: boolean;
  discountPercentage?: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  salesCount: number;
  rating: number;
  reviewCount: number;
}

interface ProductsStore {
  products: Product[];
  
  // Getters
  featuredProducts: () => Product[];
  promotionalProducts: () => Product[];
  recentProducts: () => Product[];
  allActiveProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
  
  // Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'salesCount' | 'rating' | 'reviewCount'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setFeatured: (id: string, featured: boolean) => void;
  setPromotional: (id: string, isPromotional: boolean, discountPercentage?: number) => void;
  removePromotional: (id: string) => void;
  
  // Debug
  debugProducts: () => void;
}

// Default products that show immediately
const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Digital Blood Pressure Monitor',
    price: 25000,
    originalPrice: 30000,
    category: 'Diagnostic',
    description: 'Professional-grade digital blood pressure monitor with accurate readings.',
    specifications: { 'Display': 'LCD', 'Memory': '120 readings' },
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600',
    stock: 50,
    status: 'active',
    isPromotional: true,
    discountPercentage: 17,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    salesCount: 150,
    rating: 4.5,
    reviewCount: 45,
  },
  {
    id: '2',
    name: 'Surgical Face Masks (Pack of 50)',
    price: 3500,
    category: 'PPE',
    description: '3-ply disposable surgical masks with 95% bacterial filtration.',
    specifications: { 'Layers': '3-ply', 'Filtration': 'BFE ≥ 95%' },
    image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=600',
    stock: 200,
    status: 'active',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    salesCount: 500,
    rating: 4.2,
    reviewCount: 89,
  },
];

// Helper to safely access localStorage
const getStorage = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return undefined;
};

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set, get) => ({
      // Start with default products if no stored data
      products: defaultProducts,

      featuredProducts: () => {
        const prods = get().products.filter((p) => p.featured && p.status === 'active');
        console.log('Featured products:', prods.length, prods.map(p => p.name));
        return prods;
      },
      
      promotionalProducts: () => {
        return get().products.filter((p) => p.isPromotional && p.status === 'active');
      },
      
      recentProducts: () => {
        return get()
          .products.filter((p) => p.status === 'active')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 8);
      },
      
      allActiveProducts: () => {
        return get().products.filter((p) => p.status === 'active');
      },

      getProductById: (id) => get().products.find((p) => p.id === id),
      
      getProductsByCategory: (category) => 
        get().products.filter((p) => p.category === category && p.status === 'active'),
      
      searchProducts: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().products.filter(
          (p) =>
            (p.name.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)) &&
            p.status === 'active'
        );
      },

      addProduct: async (productData) => {
        console.log('Adding product with data:', productData);

        // Ensure image is valid - use data URI or placeholder
        let finalImage = productData.image;
        if (!finalImage || finalImage.trim() === '' || finalImage.includes('/uploads/')) {
          finalImage = getPlaceholderImage(productData.category);
          console.log('Using placeholder image:', finalImage);
        }

        const newProduct: Product = {
          ...productData,
          id: 'PROD-' + Date.now(),
          image: finalImage,
          gallery: finalImage ? [finalImage] : [getPlaceholderImage(productData.category)],
          salesCount: 0,
          rating: 0,
          reviewCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active',
          featured: true, // Always feature new products
        };
        
        console.log('Created new product:', newProduct);
        
        // Update state
        set((state) => {
          const updated = [...state.products, newProduct];
          console.log('Updated products count:', updated.length);
          return { products: updated };
        });

        // Force persist by manually saving to localStorage
        const storage = getStorage();
        if (storage) {
          const currentData = JSON.parse(storage.getItem('fittrust-products-storage') || '{}');
          const updatedProducts = [...(currentData.state?.products || []), newProduct];
          storage.setItem('fittrust-products-storage', JSON.stringify({
            state: { products: updatedProducts },
            version: 0
          }));
          console.log('Manually saved to localStorage');
        }

        return newProduct;
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      setFeatured: (id, featured) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, featured, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      setPromotional: (id, isPromotional, discountPercentage) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id 
              ? { 
                  ...p, 
                  isPromotional, 
                  discountPercentage: isPromotional ? (discountPercentage || p.discountPercentage || 10) : undefined,
                  updatedAt: new Date().toISOString() 
                } 
              : p
          ),
        }));
      },

      removePromotional: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id 
              ? { 
                  ...p, 
                  isPromotional: false, 
                  discountPercentage: undefined,
                  updatedAt: new Date().toISOString() 
                } 
              : p
          ),
        }));
      },

      debugProducts: () => {
        console.log('Current products in store:', get().products);
        console.log('Featured:', get().featuredProducts());
        console.log('Active:', get().allActiveProducts());
      },
    }),
    {
      name: 'fittrust-products-storage',
      storage: createJSONStorage(() => getStorage() || localStorage),
      skipHydration: false, // Important: don't skip hydration
      partialize: (state) => ({ products: state.products }), // Only persist products
      // FIXED: onRehydrateStorage must return a function
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Error rehydrating products:', error);
          return;
        }
        console.log('Rehydrated products:', state?.products?.length || 0);
        // If no products after rehydration, use defaults
        if (!state?.products || state.products.length === 0) {
          console.log('No products found after rehydration');
        }
      },
    }
  )
);