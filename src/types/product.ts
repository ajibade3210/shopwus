export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export interface Category {
  id: string;
  businessId: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  title: string;
  sku?: string | null;
  price: number | string;
  compareAtPrice?: number | string | null;
  costPrice?: number | string | null;
  inventoryCount: number;
  options: Record<string, string>;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariantInput {
  id?: string;
  title: string;
  sku?: string | null;
  price: number;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  inventoryCount: number;
  options: Record<string, string>;
  imageUrl?: string | null;
}

export interface Product {
  id: string;
  businessId: string;
  categoryId?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  sku?: string | null;
  price: number | string;
  compareAtPrice?: number | string | null;
  costPrice?: number | string | null;
  trackInventory: boolean;
  inventoryCount: number;
  lowStockThreshold: number;
  allowBackorder: boolean;
  hasVariants: boolean;
  options?: ProductOption[] | null;
  variants?: ProductVariant[];
  images: string[];
  status: ProductStatus;
  isFeatured: boolean;
  attributes?: Record<string, unknown> | null;
  requiresShipping?: boolean;
  weightKg?: number | string | null;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface ProductSummary {
  total: number;
  active: number;
  lowStock: number;
  outOfStock: number;
}

export interface ProductInput {
  name: string;
  categoryId?: string | null;
  description?: string | null;
  sku?: string | null;
  price: number;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  trackInventory: boolean;
  inventoryCount: number;
  lowStockThreshold: number;
  allowBackorder: boolean;
  hasVariants?: boolean;
  options?: ProductOption[] | null;
  variants?: ProductVariantInput[] | null;
  images: string[];
  status: ProductStatus;
  isFeatured: boolean;
  attributes?: Record<string, unknown> | null;
  requiresShipping?: boolean;
  weightKg?: number | null;
}

export interface CartItem {
  id: string; // Composite key: `${productId}-${variantId || "base"}`
  productId: string;
  variantId?: string | null;
  variantTitle?: string | null;
  product: Product;
  selectedVariant?: ProductVariant | null;
  price: number;
  quantity: number;
  selectedOptions?: Record<string, string>;
}

export interface CartContextValue {
  items: CartItem[];
  addItem: (
    product: Product,
    quantity?: number,
    selectedOptions?: Record<string, string>,
    selectedVariant?: ProductVariant | null
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

export interface StockValidationIssue {
  productId: string;
  variantId?: string | null;
  productName: string;
  issue: "OUT_OF_STOCK" | "INSUFFICIENT_STOCK" | "PRODUCT_UNAVAILABLE";
  requestedQty: number;
  availableQty: number;
}

export interface StockValidationResult {
  isValid: boolean;
  issues: StockValidationIssue[];
  checkedAt: string;
}

export interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess?: () => void;
}

export interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onRefresh?: () => void;
}

export interface StudioProductsSectionProps {
  slug: string;
  themeColor?: string;
  buttonRadius?: string;
}

export interface CartDrawerProps {
  slug: string;
  studioName?: string;
  buttonColor?: string;
  radiusClass?: string;
}

export interface CartFloatingButtonProps {
  buttonColor?: string;
  radiusClass?: string;
}

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  studioName?: string;
  buttonColor?: string;
  radiusClass?: string;
  onOrderComplete?: (order: import("./order").Order) => void;
}

export interface GetProductsParams {
  [key: string]: string | number | boolean | null | undefined;
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: ProductStatus;
  isFeatured?: boolean;
  lowStock?: boolean;
  sortBy?: "createdAt" | "name" | "price" | "inventoryCount";
  sortOrder?: "asc" | "desc";
}

export interface ProductsResponse {
  items: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface ProductVariantMatrixProps {
  options: ProductOption[];
  variants: ProductVariantInput[];
  bulkPrice: string;
  bulkStock: string;
  bulkComparePrice: string;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onOptionNameChange: (index: number, name: string) => void;
  onOptionValuesChange: (index: number, values: string) => void;
  onBulkPriceChange: (val: string) => void;
  onBulkStockChange: (val: string) => void;
  onBulkComparePriceChange: (val: string) => void;
  onApplyBulkPrice: () => void;
  onApplyBulkStock: () => void;
  onApplyBulkComparePrice: () => void;
  onUpdateVariantField: (
    index: number,
    field: keyof ProductVariantInput,
    value: string | number | null | Record<string, string>
  ) => void;
}

export interface ProductImageUploaderProps {
  images: string[];
  imageInput: string;
  onImageInputChange: (val: string) => void;
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
}

export interface StorefrontProductsResponse {
  items: Product[];
  categories: Category[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}
