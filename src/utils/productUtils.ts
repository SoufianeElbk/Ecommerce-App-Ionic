import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';

export interface Product {
  id: number;
  name: string;
  price: number;
  discountPrice: number | null;
  rating: number;
  images: string[];
  colors: string[];
  description: string;
  categoryId: number;
  featured: boolean;
  trending: boolean;
  specifications: any;
  reviews: number;
  inStock: boolean;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  image: string;
  productCount: number;
}

// Get all products
export const getAllProducts = (): Product[] => {
  return productsData as unknown as Product[];
};

// Get products by category
export const getProductsByCategory = (categoryId: number): Product[] => {
  return productsData.filter(product => product.categoryId === categoryId) as unknown as Product[];
};

// Get a single product by ID
export const getProductById = (id: number): Product | undefined => {
  return productsData.find(product => product.id === id) as unknown as Product | undefined;
};

// Get featured products
export const getFeaturedProducts = (): Product[] => {
  return productsData.filter(product => product.featured) as unknown as Product[];
};

// Get trending products
export const getTrendingProducts = (): Product[] => {
  return productsData.filter(product => product.trending) as unknown as Product[];
};

// Get related products (same category, excluding the current product)
export const getRelatedProducts = (productId: number): Product[] => {
  const product = getProductById(productId);
  
  if (!product) return [];
  
  return productsData
    .filter(p => p.categoryId === product.categoryId && p.id !== productId)
    .slice(0, 4) as unknown as Product[];
};

// Get all categories
export const getAllCategories = (): Category[] => {
  return categoriesData as Category[];
};

// Get a category by ID
export const getCategoryById = (id: number): Category | undefined => {
  return categoriesData.find(category => category.id === id) as Category | undefined;
};

// Format price (e.g., $199.99)
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

// Calculate discount percentage
export const calculateDiscountPercentage = (originalPrice: number, discountPrice: number | null): number => {
  if (!discountPrice) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

// Search products
export const searchProducts = (query: string): Product[] => {
  const lowerCaseQuery = query.toLowerCase();
  return productsData.filter(product => 
    product.name.toLowerCase().includes(lowerCaseQuery) || 
    product.description.toLowerCase().includes(lowerCaseQuery)
  ) as unknown as Product[];
};

// Filter products by various criteria
export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  categoryIds?: number[];
  inStockOnly?: boolean;
}

export const filterProducts = (products: Product[], options: FilterOptions): Product[] => {
  return products.filter(product => {
    const actualPrice = product.discountPrice || product.price;
    
    // Filter by price range
    if (options.minPrice !== undefined && actualPrice < options.minPrice) {
      return false;
    }
    if (options.maxPrice !== undefined && actualPrice > options.maxPrice) {
      return false;
    }
    
    // Filter by categories
    if (options.categoryIds && options.categoryIds.length > 0) {
      if (!options.categoryIds.includes(product.categoryId)) {
        return false;
      }
    }
    
    // Filter by stock status
    if (options.inStockOnly && !product.inStock) {
      return false;
    }
    
    return true;
  });
}; 