export interface CollectionImage {
  url: string;
  alt?: string;
  isMain: boolean;
  order: number;
}

export interface ICollection {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  images: CollectionImage[];
  basePrice: number;
  discountType?: 'percentage' | 'fixed' | null;
  discountValue?: number;
  finalPrice: number;
  discountStartDate?: string;
  discountEndDate?: string;
  totalStock: number;
  availableStock: number;
  lowStockThreshold?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];
  category: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionInput {
  name: string;
  slug: string;
  description?: string;
  images: CollectionImage[];
  basePrice: number;
  discountType?: 'percentage' | 'fixed' | null;
  discountValue?: number;
  discountStartDate?: string;
  discountEndDate?: string;
  totalStock: number;
  availableStock: number;
  lowStockThreshold?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  category: string;
  tags?: string[];
  isFeatured?: boolean;
}

export interface CollectionStats {
  totalCollections: number;
  activeCollections: number;
  featuredCollections: number;
  lowStockCollections: number;
  totalInventoryValue: number;
}

export interface LowStockItem {
  _id: string;
  name: string;
  slug: string;
  availableStock: number;
  lowStockThreshold: number;
  category: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface UpdateCollectionInput {
  name?: string;
  slug?: string;
  description?: string;
  images?: CollectionImage[];
  basePrice?: number;
  discountType?: 'percentage' | 'fixed' | null;
  discountValue?: number;
  discountStartDate?: string;
  discountEndDate?: string;
  totalStock?: number;
  availableStock?: number;
  lowStockThreshold?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  category?: string;
  tags?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
}

export type Collection = ICollection;

export type CollectionListResponse = PaginatedResponse<Collection>;
