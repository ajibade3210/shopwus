"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useCategoriesQuery, useProductSummaryQuery, useProductsQuery } from "@/hooks/queries";
import type { Product, ProductStatus } from "@/types";
import { Metric, MetricsGrid, PageTitle } from "./common";
import { ProductModal } from "./products/product-modal";
import { ProductsTable } from "./products/products-table";

export function ProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "">("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: summary, isLoading: isSummaryLoading } = useProductSummaryQuery();
  const { data: categories = [] } = useCategoriesQuery();
  const {
    data: productsData,
    isLoading,
    refetch,
  } = useProductsQuery({
    page,
    limit: pageSize,
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

  const handleSearch = (q: string) => {
    setSearch(q);
    setPage(1);
  };

  const handleCategoryFilter = (cat: string) => {
    setCategoryFilter(cat);
    setPage(1);
  };

  const handleStatusFilter = (status: ProductStatus | "") => {
    setStatusFilter(status);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
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
    <section className="content font-sans">
      <PageTitle title="Products & Inventory" action={action} />

      {/* Top Metrics Row */}
      <MetricsGrid cols={4}>
        <Metric
          label="Total products"
          value={String(summary?.total || 0)}
          detail="Catalog items"
          isLoading={isSummaryLoading}
        />
        <Metric
          label="Active in store"
          value={String(summary?.active || 0)}
          detail="Visible to buyers"
          isLoading={isSummaryLoading}
        />
        <Metric
          label="Low stock alerts"
          value={String(summary?.lowStock || 0)}
          detail="Threshold ≤ 5 remaining"
          isLoading={isSummaryLoading}
        />
        <Metric
          label="Out of stock"
          value={String(summary?.outOfStock || 0)}
          detail="Requires replenishment"
          isLoading={isSummaryLoading}
        />
      </MetricsGrid>

      {/* Standard Register Table matching Expenses, Invoices, and Transactions */}
      <ProductsTable
        products={products}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onRefresh={refetch}
        searchQuery={search}
        onSearch={handleSearch}
        categoryFilter={categoryFilter}
        onCategoryChange={handleCategoryFilter}
        categories={categories}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilter}
        currentPage={page}
        totalPages={meta?.totalPages || 1}
        pageSize={pageSize}
        totalRecords={meta?.total || 0}
        startIndex={(page - 1) * pageSize}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />

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
