"use client";

import { AlertTriangle, Edit2, MoreVertical, Package, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useDeleteProductMutation } from "@/hooks/queries";
import type { ProductsTableProps } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { StatusBadge } from "../common/status-badge";

export function ProductsTable({ products, isLoading, onEdit }: ProductsTableProps) {
  const deleteMutation = useDeleteProductMutation();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  const confirmDelete = async () => {
    if (!productToDelete) return;
    await deleteMutation.mutateAsync(productToDelete.id);
    setProductToDelete(null);
    setActiveMenuId(null);
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-muted">
        <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
        Loading catalog...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-16 text-center text-muted">
        <Package size={36} className="mx-auto mb-3 text-outline" />
        <h3 className="text-sm font-bold text-on-surface">No products found</h3>
        <p className="text-xs mt-1">Start by adding your first product to your online store.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-on-surface border-collapse font-sans">
          <thead>
            <tr className="border-b border-border-hairline bg-surface-container-low text-muted font-bold text-[10px] uppercase tracking-wider">
              <th className="py-3.5 px-4">Product</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Inventory</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline">
            {products.map(product => {
              const isLowStock =
                product.trackInventory &&
                product.inventoryCount > 0 &&
                product.inventoryCount <= (product.lowStockThreshold || 5);
              const isOutOfStock = product.trackInventory && product.inventoryCount <= 0;

              return (
                <tr key={product.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="py-3.5 px-4">
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
                        <div className="font-semibold text-on-surface group-hover:text-primary flex items-center gap-1.5 transition-colors">
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

                  <td className="py-3.5 px-4 text-muted">
                    {product.category?.name || (
                      <span className="text-outline italic">Uncategorized</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-sans font-bold tabular-nums tracking-tight">
                    <div>{formatCurrency(Number(product.price))}</div>
                    {product.compareAtPrice && (
                      <div className="text-[10px] text-outline line-through font-sans tabular-nums font-normal">
                        {formatCurrency(Number(product.compareAtPrice))}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
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

                  <td className="py-3.5 px-4">
                    <StatusBadge status={product.status} />
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(activeMenuId === product.id ? null : product.id)
                        }
                        className="p-1.5 text-outline hover:text-on-surface rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
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
            })}
          </tbody>
        </table>
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
