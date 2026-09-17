"use client";

import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useCategoriesQuery, useProductSummaryQuery, useProductsQuery } from "@/hooks/queries";
import type { Product, ProductStatus } from "@/types";
import { Metric, PageTitle } from "./admin-layout";
import { ProductModal } from "./products/product-modal";
import { ProductsTable } from "./products/products-table";

export function ProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "">("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: summary } = useProductSummaryQuery();
  const { data: categories = [] } = useCategoriesQuery();
  const {
    data: productsData,
    isLoading,
    refetch,
  } = useProductsQuery({
    page,
    limit: 15,
    search: search || undefined,
    categoryId: categoryFilter || undefined,
    status: (statusFilter as ProductStatus) || undefined,
  });

  const products = productsData?.items || [];
  const meta = productsData?.meta;

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const action = (
    <button
      type="button"
      onClick={handleOpenCreate}
      className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 sm:py-2.5 rounded-md text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50"
    >
      <Plus size={14} />
      <span>Add Product</span>
    </button>
  );

  return (
    <section className="content">
      <PageTitle title="Products & Inventory" action={action} />

      {/* Top Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-7">
        <Metric label="Total Products" value={String(summary?.total || 0)} />
        <Metric label="Active in Store" value={String(summary?.active || 0)} />
        <Metric label="Low Stock Alerts" value={String(summary?.lowStock || 0)} />
        <Metric label="Out of Stock" value={String(summary?.outOfStock || 0)} />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-border-hairline rounded-xl p-3 sm:p-4 shadow-card space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="text"
              placeholder="Search products by title, SKU..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs bg-surface-low border border-border-hairline rounded-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={e => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs bg-surface-low border border-border-hairline rounded-md font-medium text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value ? (e.target.value as ProductStatus) : "");
                setPage(1);
              }}
              className="px-3 py-2 text-xs bg-surface-low border border-border-hairline rounded-md font-medium text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>

        {/* Product Table */}
        <ProductsTable
          products={products}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onRefresh={refetch}
        />

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between pt-3 border-t border-border-hairline text-xs text-on-surface-variant">
            <div>
              Showing Page <b>{meta.page}</b> of <b>{meta.totalPages}</b> ({meta.total} products)
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="p-1.5 rounded-md border border-border-hairline hover:bg-surface-low text-on-surface disabled:opacity-40 cursor-pointer transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                disabled={page >= meta.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded-md border border-border-hairline hover:bg-surface-low text-on-surface disabled:opacity-40 cursor-pointer transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSuccess={() => refetch()}
      />
    </section>
  );
}
