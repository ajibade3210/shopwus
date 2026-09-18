"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  createCategory,
  createProduct,
  deleteProduct,
  getCategories,
  getProductById,
  getProductSummary,
  getProducts,
  getStorefrontProductDetails,
  getStorefrontProducts,
  updateProduct,
} from "@/services/api/product.service";
import type { GetProductsParams, ProductInput } from "@/types";

export function useProductsQuery(params?: GetProductsParams) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => getProducts(params),
  });
}

export function useProductSummaryQuery() {
  return useQuery({
    queryKey: queryKeys.products.summary(),
    queryFn: () => getProductSummary(),
  });
}

export function useProductQuery(id: string | null | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.products.detail(id) : ["products", "detail", "empty"],
    queryFn: () => {
      if (!id) throw new Error("Product ID required");
      return getProductById(id);
    },
    enabled: Boolean(id),
  });
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.products.categories(),
    queryFn: () => getCategories(),
  });
}

export function useStorefrontProductsQuery(
  slug: string | null | undefined,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    categorySlug?: string;
    isFeatured?: boolean;
    sortBy?: "createdAt" | "name" | "price";
    sortOrder?: "asc" | "desc";
  }
) {
  return useQuery({
    queryKey: slug
      ? queryKeys.products.storefront(slug, params)
      : ["products", "storefront", "empty"],
    queryFn: () => {
      if (!slug) throw new Error("Slug required");
      return getStorefrontProducts(slug, params);
    },
    enabled: Boolean(slug),
  });
}

export function useStorefrontProductDetailQuery(
  slug: string | null | undefined,
  productSlug: string | null | undefined
) {
  return useQuery({
    queryKey:
      slug && productSlug
        ? queryKeys.products.storefrontDetail(slug, productSlug)
        : ["products", "storefront-detail", "empty"],
    queryFn: () => {
      if (!slug || !productSlug) throw new Error("Slug and productSlug required");
      return getStorefrontProductDetails(slug, productSlug);
    },
    enabled: Boolean(slug && productSlug),
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductInput) => createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ProductInput> }) =>
      updateProduct(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.id) });
    },
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; description?: string; imageUrl?: string }) =>
      createCategory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.categories() });
    },
  });
}
