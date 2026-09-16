"use client";

import { AlertCircle, Layers, Truck, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/hooks/queries";
import type { ProductModalProps, ProductOption, ProductVariantInput } from "@/types";
import { ProductImageUploader } from "./product-image-uploader";
import { ProductVariantMatrix } from "./product-variant-matrix";

const WEIGHT_PRESETS = [
  { label: "0.5kg", sub: "Small", val: "0.5" },
  { label: "1.0kg", sub: "Standard", val: "1.0" },
  { label: "2.0kg", sub: "Shoes/Boxed", val: "2.0" },
  { label: "5.0kg", sub: "Heavy", val: "5.0" },
] as const;

export function ProductModal({ isOpen, onClose, product, onSuccess }: ProductModalProps) {
  const isEditing = Boolean(product);
  const { data: categories = [] } = useCategoriesQuery();
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    description: "",
    sku: "",
    price: "",
    compareAtPrice: "",
    costPrice: "",
    trackInventory: true,
    inventoryCount: "10",
    lowStockThreshold: "5",
    allowBackorder: false,
    hasVariants: false,
    images: [] as string[],
    status: "ACTIVE" as "ACTIVE" | "DRAFT" | "ARCHIVED",
    isFeatured: false,
    requiresShipping: true,
    weightKg: "0.5",
  });

  // Variant Options & Matrix State
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [variants, setVariants] = useState<ProductVariantInput[]>([]);
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkStock, setBulkStock] = useState("");
  const [bulkComparePrice, setBulkComparePrice] = useState("");

  const [imageInput, setImageInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (product) {
      setFormData({
        name: product.name,
        categoryId: product.categoryId || "",
        description: product.description || "",
        sku: product.sku || "",
        price: String(product.price || ""),
        compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
        costPrice: product.costPrice ? String(product.costPrice) : "",
        trackInventory: product.trackInventory,
        inventoryCount: String(product.inventoryCount),
        lowStockThreshold: String(product.lowStockThreshold),
        allowBackorder: product.allowBackorder,
        hasVariants: Boolean(product.hasVariants),
        images: product.images || [],
        status: product.status,
        isFeatured: product.isFeatured,
        requiresShipping: product.requiresShipping !== false,
        weightKg: product.weightKg ? String(product.weightKg) : "0.5",
      });

      if (product.hasVariants && product.variants && product.variants.length > 0) {
        setOptions(product.options || []);
        setVariants(
          product.variants.map(v => ({
            id: v.id,
            title: v.title,
            sku: v.sku || "",
            price: Number(v.price),
            compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
            costPrice: v.costPrice ? Number(v.costPrice) : null,
            inventoryCount: v.inventoryCount,
            options: v.options || {},
            imageUrl: v.imageUrl || null,
          }))
        );
      } else {
        setOptions([]);
        setVariants([]);
      }
    } else {
      setFormData({
        name: "",
        categoryId: "",
        description: "",
        sku: "",
        price: "",
        compareAtPrice: "",
        costPrice: "",
        trackInventory: true,
        inventoryCount: "10",
        lowStockThreshold: "5",
        allowBackorder: false,
        hasVariants: false,
        images: [],
        status: "ACTIVE",
        isFeatured: false,
        requiresShipping: true,
        weightKg: "0.5",
      });
      setOptions([]);
      setVariants([]);
    }
    setError(null);
  }, [product, isOpen]);

  if (!isOpen) return null;

  // ---------------------------------------------------------------------------
  // VARIANT MATRIX GENERATION
  // ---------------------------------------------------------------------------

  const handleAddOption = () => {
    setOptions(prev => [...prev, { name: "", values: [] }]);
  };

  const handleRemoveOption = (index: number) => {
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);
    regenerateVariants(updated);
  };

  const handleOptionNameChange = (index: number, name: string) => {
    const updated = [...options];
    updated[index].name = name;
    setOptions(updated);
  };

  const handleOptionValuesChange = (index: number, rawValues: string) => {
    const values = rawValues
      .split(",")
      .map(v => v.trim())
      .filter(Boolean);
    const updated = [...options];
    updated[index].values = values;
    setOptions(updated);
    regenerateVariants(updated);
  };

  const regenerateVariants = (currentOptions: ProductOption[]) => {
    const validOptions = currentOptions.filter(o => o.name.trim() && o.values.length > 0);
    if (validOptions.length === 0) {
      setVariants([]);
      return;
    }

    // Cartesian product combination helper
    const cartesian = (arrays: string[][]): string[][] => {
      return arrays.reduce<string[][]>(
        (acc, curr) => acc.flatMap(a => curr.map(c => [...a, c])),
        [[]]
      );
    };

    const combinations = cartesian(validOptions.map(o => o.values));
    const defaultPrice = Number.parseFloat(formData.price) || 0;
    const defaultStock = Number.parseInt(formData.inventoryCount, 10) || 10;
    const defaultCompare = formData.compareAtPrice
      ? Number.parseFloat(formData.compareAtPrice)
      : null;

    const newVariants: ProductVariantInput[] = combinations.map(combo => {
      const optionMap: Record<string, string> = {};
      validOptions.forEach((opt, idx) => {
        optionMap[opt.name] = combo[idx];
      });

      const title = combo.join(" / ");
      const existing = variants.find(v => v.title === title);

      return {
        id: existing?.id,
        title,
        sku: existing?.sku || (formData.sku ? `${formData.sku}-${combo.join("-")}` : ""),
        price: existing?.price || defaultPrice,
        compareAtPrice: existing?.compareAtPrice ?? defaultCompare,
        costPrice: existing?.costPrice ?? null,
        inventoryCount: existing !== undefined ? existing.inventoryCount : defaultStock,
        options: optionMap,
        imageUrl: existing?.imageUrl || null,
      };
    });

    setVariants(newVariants);
  };

  // Bulk Apply Matrix Actions
  const handleApplyBulkPrice = () => {
    const p = Number.parseFloat(bulkPrice);
    if (Number.isNaN(p) || p <= 0) return;
    setVariants(prev => prev.map(v => ({ ...v, price: p })));
  };

  const handleApplyBulkStock = () => {
    const s = Number.parseInt(bulkStock, 10);
    if (Number.isNaN(s) || s < 0) return;
    setVariants(prev => prev.map(v => ({ ...v, inventoryCount: s })));
  };

  const handleApplyBulkComparePrice = () => {
    const cp = Number.parseFloat(bulkComparePrice);
    setVariants(prev => prev.map(v => ({ ...v, compareAtPrice: Number.isNaN(cp) ? null : cp })));
  };

  const handleUpdateVariantField = (
    index: number,
    field: keyof ProductVariantInput,
    value: string | number | null | Record<string, string>
  ) => {
    setVariants(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // ---------------------------------------------------------------------------
  // SUBMIT HANDLER
  // ---------------------------------------------------------------------------

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
      }));
      setImageInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const priceNum = Number.parseFloat(formData.price);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      setError("Please enter a valid base price greater than 0");
      return;
    }

    if (formData.hasVariants && variants.length === 0) {
      setError("Please define at least one variant option value or disable variants.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      categoryId: formData.categoryId || null,
      description: formData.description.trim() || null,
      sku: formData.sku.trim() || null,
      price: priceNum,
      compareAtPrice: formData.compareAtPrice ? Number.parseFloat(formData.compareAtPrice) : null,
      costPrice: formData.costPrice ? Number.parseFloat(formData.costPrice) : null,
      trackInventory: formData.trackInventory,
      inventoryCount: formData.trackInventory
        ? Number.parseInt(formData.inventoryCount, 10) || 0
        : 0,
      lowStockThreshold: Number.parseInt(formData.lowStockThreshold, 10) || 5,
      allowBackorder: formData.allowBackorder,
      hasVariants: formData.hasVariants,
      options: formData.hasVariants
        ? options.filter(o => o.name.trim() && o.values.length > 0)
        : null,
      variants: formData.hasVariants ? variants : null,
      images: formData.images,
      status: formData.status,
      isFeatured: formData.isFeatured,
      requiresShipping: formData.requiresShipping,
      weightKg:
        formData.requiresShipping && formData.weightKg
          ? Number.parseFloat(formData.weightKg)
          : null,
    };

    try {
      if (isEditing && product) {
        await updateMutation.mutateAsync({ id: product.id, input: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save product";
      setError(msg);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#eee7dc] overflow-hidden my-8 font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#eee7dc] bg-[#faf8f5]">
          <div>
            <h2 className="text-base font-bold text-[#191c1d]">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-xs text-[#6b7280]">
              {isEditing
                ? "Update catalog details, multi-SKU variants, and stock"
                : "Create a new item in your storefront catalog"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#6b7280] hover:text-[#191c1d] rounded-lg hover:bg-[#f3f4f6] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl font-medium flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#191c1d] mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., The Saffiano Heritage Satchel"
                className="w-full px-3.5 py-2.5 text-xs bg-[#faf8f5] border border-[#e5e7eb] rounded-xl transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191c1d] mb-1.5">Category</label>
              <select
                value={formData.categoryId}
                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-[#faf8f5] border border-[#e5e7eb] rounded-xl transition-all"
              >
                <option value="">None / Uncategorized</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191c1d] mb-1.5">
                SKU / Base Code
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g., SAT-HRTG-01"
                className="w-full px-3.5 py-2.5 text-xs bg-[#faf8f5] border border-[#e5e7eb] rounded-xl font-mono transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#191c1d] mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe material composition, sizing, fitting, and care instructions..."
                className="w-full px-3.5 py-2.5 text-xs bg-[#faf8f5] border border-[#e5e7eb] rounded-xl transition-all resize-none"
              />
            </div>
          </div>

          {/* Pricing & Base Stock */}
          <div className="pt-4 border-t border-[#eee7dc]">
            <h3 className="text-xs font-bold text-[#191c1d] uppercase tracking-wider mb-3">
              Base Pricing & Inventory
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#191c1d] mb-1.5">
                  {formData.hasVariants ? "Base / Min Price (NGN) *" : "Price (NGN) *"}
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#faf8f5] border border-[#e5e7eb] rounded-xl font-sans font-bold tabular-nums transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6b7280] mb-1.5">
                  Compare-at Price (NGN)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.compareAtPrice}
                  onChange={e => setFormData({ ...formData, compareAtPrice: e.target.value })}
                  placeholder="Original price"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#faf8f5] border border-[#e5e7eb] rounded-xl font-sans tabular-nums transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6b7280] mb-1.5">
                  Cost Price (NGN)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={e => setFormData({ ...formData, costPrice: e.target.value })}
                  placeholder="Unit cost"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#faf8f5] border border-[#e5e7eb] rounded-xl font-sans tabular-nums transition-all"
                />
              </div>
            </div>

            {!formData.hasVariants && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-[#191c1d] mb-1.5">
                    Available Stock Units
                  </label>
                  <input
                    type="number"
                    value={formData.inventoryCount}
                    onChange={e => setFormData({ ...formData, inventoryCount: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#faf8f5] border border-[#e5e7eb] rounded-xl font-sans font-bold tabular-nums transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#191c1d] mb-1.5">
                    Low Stock Warning At
                  </label>
                  <input
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={e => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#faf8f5] border border-[#e5e7eb] rounded-xl font-sans tabular-nums transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Variants & Multi-SKU Section */}
          <div className="pt-4 border-t border-[#eee7dc] space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-[#faf7f2] border border-[#e8dfd2] rounded-2xl">
              <div className="flex items-center gap-2.5">
                <Layers size={18} className="text-[#9e633d]" />
                <div>
                  <h3 className="text-xs font-bold text-[#191c1d]">Product Options & Variants</h3>
                  <p className="text-[11px] text-[#9e633d]">
                    Enable multiple options (e.g. Size, Color) with discrete stock counts, prices,
                    and SKUs.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasVariants}
                  onChange={e => {
                    const checked = e.target.checked;
                    setFormData({ ...formData, hasVariants: checked });
                    if (checked && options.length === 0) {
                      setOptions([{ name: "Size", values: ["S", "M", "L"] }]);
                      regenerateVariants([{ name: "Size", values: ["S", "M", "L"] }]);
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#111827]" />
              </label>
            </div>

            {formData.hasVariants && (
              <ProductVariantMatrix
                options={options}
                variants={variants}
                bulkPrice={bulkPrice}
                bulkStock={bulkStock}
                bulkComparePrice={bulkComparePrice}
                onAddOption={handleAddOption}
                onRemoveOption={handleRemoveOption}
                onOptionNameChange={handleOptionNameChange}
                onOptionValuesChange={handleOptionValuesChange}
                onBulkPriceChange={setBulkPrice}
                onBulkStockChange={setBulkStock}
                onBulkComparePriceChange={setBulkComparePrice}
                onApplyBulkPrice={handleApplyBulkPrice}
                onApplyBulkStock={handleApplyBulkStock}
                onApplyBulkComparePrice={handleApplyBulkComparePrice}
                onUpdateVariantField={handleUpdateVariantField}
              />
            )}
          </div>

          {/* Product Images */}
          <ProductImageUploader
            images={formData.images}
            imageInput={imageInput}
            onImageInputChange={setImageInput}
            onAddImage={handleAddImage}
            onRemoveImage={handleRemoveImage}
          />

          {/* Shipping & Parcel Weight */}
          <div className="pt-4 border-t border-[#eee7dc] space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-[#faf8f5] border border-[#e5e7eb] rounded-2xl">
              <div className="flex items-center gap-2.5">
                <Truck size={18} className="text-[#6b7280]" />
                <div>
                  <h3 className="text-xs font-bold text-[#191c1d]">Requires Physical Delivery</h3>
                  <p className="text-[11px] text-[#6b7280]">
                    Disable for digital downloads, e-books, or in-person appointments.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requiresShipping}
                  onChange={e => setFormData({ ...formData, requiresShipping: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#111827]" />
              </label>
            </div>

            {formData.requiresShipping && (
              <div className="p-3.5 bg-[#faf8f5] border border-[#e5e7eb] rounded-2xl space-y-2.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#191c1d]">
                      Estimated Parcel Weight (kg)
                    </label>
                    <span className="text-[11px] text-[#6b7280]">Includes packaging box</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="100"
                      placeholder="1.0"
                      value={formData.weightKg}
                      onChange={e => setFormData({ ...formData, weightKg: e.target.value })}
                      className="w-full sm:w-44 px-3.5 py-2 text-xs bg-white border border-[#e5e7eb] rounded-xl font-sans font-bold tabular-nums"
                    />
                    <span className="text-xs font-medium text-[#6b7280]">kg</span>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] text-[#6b7280] mb-1.5 font-medium">Quick presets:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {WEIGHT_PRESETS.map(preset => {
                      const isActive =
                        Number.parseFloat(formData.weightKg) === Number.parseFloat(preset.val);
                      return (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => setFormData({ ...formData, weightKg: preset.val })}
                          className={`px-2.5 py-1 text-[11px] rounded-lg border transition-all cursor-pointer font-medium ${
                            isActive
                              ? "bg-[#111827] text-white border-[#111827]"
                              : "bg-white text-[#4b5563] border-[#e5e7eb] hover:border-[#9ca3af] hover:bg-[#fafaf9]"
                          }`}
                        >
                          {preset.label}{" "}
                          <span className="opacity-75 text-[10px]">({preset.sub})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="text-[10px] text-[#9ca3af]">
                  Used by Terminal Africa to calculate accurate real-time courier quotes at
                  storefront checkout.
                </p>
              </div>
            )}
          </div>

          {/* Status & Featured Toggle */}
          <div className="pt-4 border-t border-[#eee7dc] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="block text-xs font-semibold text-[#191c1d]">Status:</label>
              <select
                value={formData.status}
                onChange={e =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "ACTIVE" | "DRAFT" | "ARCHIVED",
                  })
                }
                className="px-3 py-1.5 text-xs bg-[#faf8f5] border border-[#e5e7eb] rounded-xl font-medium"
              >
                <option value="ACTIVE">Active (Live in Store)</option>
                <option value="DRAFT">Draft (Hidden)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-xs text-[#191c1d] font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded text-[#111827]"
              />
              Feature on Homepage
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#eee7dc] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#fafaf9] text-[#1f2937] border border-[#d1d5db] hover:border-[#9ca3af] px-4 py-2 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 bg-[#111827] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? "Saving Product..." : isEditing ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
