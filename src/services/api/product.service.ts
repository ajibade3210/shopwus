import { apiClient } from "@/lib/api-client";
import type {
  Category,
  GetProductsParams,
  Product,
  ProductInput,
  ProductSummary,
  ProductsResponse,
  StockValidationResult,
  StorefrontProductsResponse,
} from "@/types";

// ---------------------------------------------------------------------------
// VENDOR PRODUCT API
// ---------------------------------------------------------------------------

export async function getProducts(params?: GetProductsParams): Promise<ProductsResponse> {
  const data = await apiClient.get<ProductsResponse | Product[]>("/products", params);
  if (Array.isArray(data)) {
    return {
      items: data,
      meta: { total: data.length, page: 1, limit: data.length, totalPages: 1, hasMore: false },
    };
  }
  return data;
}

export async function getProductSummary(): Promise<ProductSummary> {
  return apiClient.get<ProductSummary>("/products/summary");
}

export async function getProductById(id: string): Promise<Product> {
  return apiClient.get<Product>(`/products/${encodeURIComponent(id)}`);
}

export async function createProduct(input: ProductInput): Promise<Product> {
  return apiClient.post<Product>("/products", input);
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<Product> {
  return apiClient.put<Product>(`/products/${encodeURIComponent(id)}`, input);
}

export async function deleteProduct(id: string): Promise<void> {
  return apiClient.delete<void>(`/products/${encodeURIComponent(id)}`);
}

// ---------------------------------------------------------------------------
// VENDOR CATEGORIES API
// ---------------------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  const data = await apiClient.get<Category[] | { items: Category[] }>("/products/categories");
  if (Array.isArray(data)) return data;
  if (
    data &&
    typeof data === "object" &&
    "items" in data &&
    Array.isArray((data as { items: Category[] }).items)
  ) {
    return (data as { items: Category[] }).items;
  }
  return [];
}

export async function createCategory(input: {
  name: string;
  description?: string;
  imageUrl?: string;
}): Promise<Category> {
  return apiClient.post<Category>("/products/categories", input);
}

export async function updateCategory(
  id: string,
  input: { name?: string; description?: string; imageUrl?: string }
): Promise<Category> {
  return apiClient.put<Category>(`/products/categories/${encodeURIComponent(id)}`, input);
}

export async function deleteCategory(id: string): Promise<void> {
  return apiClient.delete<void>(`/products/categories/${encodeURIComponent(id)}`);
}

// ---------------------------------------------------------------------------
// PUBLIC STOREFRONT PRODUCT API
// ---------------------------------------------------------------------------

export async function getStorefrontProducts(
  slug: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    categorySlug?: string;
    isFeatured?: boolean;
    sortBy?: "createdAt" | "name" | "price";
    sortOrder?: "asc" | "desc";
  }
): Promise<StorefrontProductsResponse> {
  return apiClient.get<StorefrontProductsResponse>(
    `/products/storefront/${encodeURIComponent(slug)}`,
    params
  );
}

export async function getStorefrontProductDetails(
  slug: string,
  productSlug: string
): Promise<Product> {
  return apiClient.get<Product>(
    `/products/storefront/${encodeURIComponent(slug)}/p/${encodeURIComponent(productSlug)}`
  );
}

export async function validateCartStock(
  slug: string,
  input: { items: Array<{ productId: string; variantId?: string; quantity: number }> }
): Promise<StockValidationResult> {
  return apiClient.post<StockValidationResult>(
    `/products/storefront/${encodeURIComponent(slug)}/cart/validate-stock`,
    input
  );
}

export const validateStorefrontCartStock = validateCartStock;
