"use client";

import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Loader2,
  MoreVertical,
  Package,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useDeleteProductMutation } from "@/hooks/queries";
import type { ProductStatus, ProductsTableProps } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { StatusBadge } from "../common/status-badge";
import { TableEmptyState } from "../common/table-empty-state";

export function ProductsTable({
  products,
  isLoading,
  onEdit,
  searchQuery,
  onSearch,
  categoryFilter,
  onCategoryChange,
  categories,
  statusFilter,
  onStatusFilterChange,
  currentPage,
  totalPages,
  pageSize,
  totalRecords,
  startIndex,
  onPageChange,
  onPageSizeChange,
}: ProductsTableProps) {
  const deleteMutation = useDeleteProductMutation();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  const confirmDelete = async () => {
    if (!productToDelete) return;
    await deleteMutation.mutateAsync(productToDelete.id);
    setProductToDelete(null);
    setActiveMenuId(null);
  };

  return (
    <>
      <div className="table-card font-sans">
        {/* Table Head matching Invoices, Expenses, and Transactions */}
        <div className="table-head justify-end">
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
            {/* Category Filter Dropdown */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={e => onCategoryChange(e.target.value)}
                aria-label="Filter products by category"
                className="h-9 appearance-none pl-3 pr-7 bg-card border border-border-hairline rounded-md text-[11px] font-medium text-on-surface hover:bg-surface-low focus:outline-none transition-colors cursor-pointer shadow-2xs font-sans"
              >
                <option value="" className="text-[11px]">
                  All Categories
                </option>
                {categories.map(c => (
                  <option key={c.id} value={c.id} className="text-[11px]">
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={e =>
                  onStatusFilterChange(e.target.value ? (e.target.value as ProductStatus) : "")
                }
                aria-label="Filter products by status"
                className="h-9 appearance-none pl-3 pr-7 bg-card border border-border-hairline rounded-md text-[11px] font-medium text-on-surface hover:bg-surface-low focus:outline-none transition-colors cursor-pointer shadow-2xs font-sans"
              >
                <option value="" className="text-[11px]">
                  All Statuses
                </option>
                <option value="ACTIVE" className="text-[11px]">
                  Active
                </option>
                <option value="DRAFT" className="text-[11px]">
                  Draft
                </option>
              </select>
              <ChevronDown
                size={12}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              />
            </div>

            {/* Standard Search Box */}
            <div className="table-search-box">
              <Search size={13} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => onSearch(e.target.value)}
                placeholder="Search products..."
              />
            </div>
          </div>
        </div>

        {/* Table Wrap */}
        <div className="overflow-x-auto flex-1 min-h-0">
          <table className="w-full border-collapse sm:min-w-[680px] text-left font-sans">
            <thead>
              <tr>
                <th className="px-3 sm:px-5 py-3 sm:py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                  Product
                </th>
                <th className="hidden sm:table-cell px-5 py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                  Category
                </th>
                <th className="px-2 sm:px-5 py-3 sm:py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                  Price
                </th>
                <th className="hidden sm:table-cell px-5 py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                  Inventory
                </th>
                <th className="px-2 sm:px-5 py-3 sm:py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                  Status
                </th>
                <th className="text-right px-3 sm:px-5 py-3 sm:py-3.5 text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-xs text-muted">
                    <Loader2 size={20} className="animate-spin mx-auto mb-2 text-primary" />
                    Loading product catalog...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <TableEmptyState
                  colSpan={6}
                  title="No products found"
                  description={
                    searchQuery || categoryFilter || statusFilter
                      ? "No products match your search query or selected filters."
                      : "Start by adding your first product to your online store."
                  }
                />
              ) : (
                products.map(product => {
                  const isLowStock =
                    product.trackInventory &&
                    product.inventoryCount > 0 &&
                    product.inventoryCount <= (product.lowStockThreshold || 5);
                  const isOutOfStock = product.trackInventory && product.inventoryCount <= 0;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-surface-container-low/50 transition-colors group"
                    >
                      <td className="px-3 sm:px-5 py-3.5 border-b border-border-hairline align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-surface-container-low border border-border-hairline overflow-hidden shrink-0 flex items-center justify-center">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package size={16} className="text-outline" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-xs sm:text-sm text-on-surface group-hover:text-primary flex items-center gap-1.5 transition-colors">
                              <span>{product.name}</span>
                              {product.hasVariants && (
                                <span className="text-[10px] font-bold bg-surface-container-high text-muted border border-border-hairline px-1.5 py-0.5 rounded-md">
                                  {product.variants?.length || 0} variants
                                </span>
                              )}
                            </div>
                            {product.sku && (
                              <div className="text-[10px] text-muted font-mono mt-0.5">
                                SKU: {product.sku}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="hidden sm:table-cell px-5 py-3.5 text-xs text-muted border-b border-border-hairline align-middle">
                        {product.category?.name || (
                          <span className="text-outline italic">Uncategorized</span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-2 sm:px-5 py-3.5 text-xs border-b border-border-hairline align-middle">
                        <span className="font-sans font-bold text-xs sm:text-sm text-on-surface tabular-nums">
                          {formatCurrency(Number(product.price))}
                        </span>
                        {product.compareAtPrice && (
                          <div className="text-[10px] text-outline line-through font-sans tabular-nums font-normal">
                            {formatCurrency(Number(product.compareAtPrice))}
                          </div>
                        )}
                      </td>

                      <td className="hidden sm:table-cell px-5 py-3.5 border-b border-border-hairline align-middle">
                        {!product.trackInventory ? (
                          <span className="text-[11px] text-muted">Don&apos;t track</span>
                        ) : isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-error bg-error/10 border border-error/20 px-2 py-0.5 rounded-md">
                            <AlertTriangle size={11} /> Out of stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md font-sans tabular-nums">
                            <AlertTriangle size={11} /> {product.inventoryCount} left
                          </span>
                        ) : (
                          <span className="text-[11px] text-on-surface font-sans font-semibold tabular-nums">
                            {product.inventoryCount} in stock
                          </span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-2 sm:px-5 py-3.5 text-xs border-b border-border-hairline align-middle">
                        <StatusBadge status={product.status} />
                      </td>

                      <td className="px-3 sm:px-5 py-3.5 text-right border-b border-border-hairline align-middle">
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuId(activeMenuId === product.id ? null : product.id)
                            }
                            className="p-1.5 text-outline hover:text-on-surface rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
                            aria-label="Product actions"
                          >
                            <MoreVertical size={14} />
                          </button>

                          {activeMenuId === product.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setActiveMenuId(null)}
                              />
                              <div className="absolute right-0 mt-1 w-32 bg-card rounded-2xl shadow-popover border border-border-hairline z-20 py-1 overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onEdit(product);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-on-surface hover:bg-surface-container-low text-left font-medium cursor-pointer transition-colors"
                                >
                                  <Edit2 size={12} /> Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setProductToDelete({ id: product.id, name: product.name });
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-error hover:bg-error/10 text-left font-medium cursor-pointer transition-colors"
                                >
                                  <Trash2 size={12} /> Archive
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-border-hairline bg-surface-container-low text-xs text-muted rounded-b-2xl font-sans">
          <div className="flex items-center gap-2">
            <span>
              Showing <b className="text-on-surface">{totalRecords === 0 ? 0 : startIndex + 1}</b>–
              <b className="text-on-surface">{Math.min(startIndex + pageSize, totalRecords)}</b> of{" "}
              <b className="text-on-surface">{totalRecords}</b> records
            </span>
            <div className="hidden sm:flex items-center gap-1.5 ml-3 border-l border-border-hairline pl-3">
              <span className="text-[11px] text-muted">Per page:</span>
              <select
                value={pageSize}
                onChange={e => onPageSizeChange(Number(e.target.value))}
                className="bg-card border border-border-hairline rounded-xl px-2 py-0.5 text-[11px] text-on-surface focus:outline-hidden"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-xl border border-border-hairline bg-card hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed text-on-surface transition-colors cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-2 text-xs font-semibold text-on-surface font-sans">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-xl border border-border-hairline bg-card hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed text-on-surface transition-colors cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border-hairline rounded-3xl shadow-popover p-6 max-w-sm w-full space-y-4 font-sans">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-on-surface">Archive Product</h4>
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="text-outline hover:text-on-surface p-1 cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-muted">
              Are you sure you want to remove <b>&ldquo;{productToDelete.name}&rdquo;</b> from your
              active catalog?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="inline-flex items-center justify-center bg-surface-container-low hover:bg-surface-container text-on-surface border border-border-hairline px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="inline-flex items-center justify-center bg-error hover:bg-error-hover text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-colors"
              >
                Archive Product
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
