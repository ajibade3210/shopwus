"use client";

import { AlertCircle, Check, Edit3, Loader2, X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { AVAILABLE_SERVICES } from "@/hooks/use-customers";
import type { CustomerAddModalProps, CustomerAttribute, NewCustomerInput } from "@/types";
import { CustomerAttributesEditor } from "./customer-attributes-editor";

export function CustomerAddModal({
  isOpen,
  isSubmitting,
  initialCustomer,
  initialMode,
  onClose,
  onSubmit,
}: CustomerAddModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  const [mode, setMode] = useState<"view" | "edit">(() => {
    if (!initialCustomer) return "edit";
    return initialMode || "view";
  });

  const [formData, setFormData] = useState<NewCustomerInput>(() => ({
    name: initialCustomer?.name || "",
    email: initialCustomer?.email || "",
    phone: initialCustomer?.phone || "",
    company: initialCustomer?.company || "",
    notes: initialCustomer?.notes || "",
    service: initialCustomer?.services?.[0]?.service || AVAILABLE_SERVICES[0],
    amount: initialCustomer?.services?.[0]?.amount || 0,
    isActive: initialCustomer ? initialCustomer.isActive : true,
  }));

  const [attributes, setAttributes] = useState<CustomerAttribute[]>(() => {
    if (initialCustomer?.attributes && initialCustomer.attributes.length > 0) {
      return initialCustomer.attributes.map((a: CustomerAttribute) => ({
        key: a.key,
        value: a.value,
      }));
    }
    return [{ key: "", value: "" }];
  });

  const [contactError, setContactError] = useState("");
  const [attributeError, setAttributeError] = useState("");

  const keyInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!isOpen) return null;

  const handleAddAttributeRow = () => {
    if (attributes.length >= 25) return;
    setAttributeError("");
    const newIdx = attributes.length;
    setAttributes(prev => [...prev, { key: "", value: "" }]);

    // DOM-safe auto-focus on newly created key input
    requestAnimationFrame(() => {
      keyInputRefs.current[newIdx]?.focus();
    });
  };

  const handleRemoveAttributeRow = (index: number) => {
    setAttributeError("");
    setAttributes(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // Keep at least 1 empty row ready for data entry
      return updated.length === 0 ? [{ key: "", value: "" }] : updated;
    });
  };

  const handleAttributeChange = (index: number, field: "key" | "value", newValue: string) => {
    setAttributeError("");
    setAttributes(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: newValue };
      return next;
    });
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setContactError("");
    setAttributeError("");

    if (!formData.name?.trim()) {
      return;
    }

    if (!formData.email?.trim() && !formData.phone?.trim()) {
      setContactError("Please provide at least one contact channel (Email or Phone/WhatsApp).");
      return;
    }

    // Validate attributes
    const seenKeys = new Set<string>();
    const prunedAttributes: CustomerAttribute[] = [];

    for (let i = 0; i < attributes.length; i++) {
      const k = attributes[i].key.trim();
      const v = attributes[i].value.trim();

      // Silently prune completely empty pairs
      if (!k && !v) {
        continue;
      }

      // Check pipe character
      if (k.includes("|") || v.includes("|")) {
        setAttributeError(`Row ${i + 1}: Pipe character (|) is not allowed.`);
        return;
      }

      // Check half-filled rows
      if (!k && v) {
        setAttributeError(`Row ${i + 1}: Please enter a name/key for this attribute.`);
        return;
      }
      if (k && !v) {
        setAttributeError(`Row ${i + 1}: Please enter a value for "${k}".`);
        return;
      }

      // Check key length
      if (k.length > 50) {
        setAttributeError(`Row ${i + 1}: Attribute key "${k}" exceeds 50 characters.`);
        return;
      }
      if (v.length > 100) {
        setAttributeError(`Row ${i + 1}: Attribute value exceeds 100 characters.`);
        return;
      }

      // Check duplicate keys case-insensitively
      const lowerKey = k.toLowerCase();
      if (seenKeys.has(lowerKey)) {
        setAttributeError(`Duplicate attribute key "${k}". Each attribute key must be unique.`);
        return;
      }
      seenKeys.add(lowerKey);

      prunedAttributes.push({ key: k, value: v });
    }

    // Check max 25 after pruning
    if (prunedAttributes.length > 25) {
      setAttributeError("Maximum 25 attributes allowed per customer.");
      return;
    }

    const payload: NewCustomerInput = {
      ...formData,
      attributes: prunedAttributes.length > 0 ? prunedAttributes : [],
    };

    const success = await onSubmit(payload);
    if (success) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border-hairline rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-popover space-y-5 relative max-h-[92vh] flex flex-col overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header (Pinned) */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-border-hairline shrink-0">
          <div>
            <h3 className="text-xl sm:text-2xl font-sans font-bold text-on-surface tracking-tight">
              {mode === "view"
                ? initialCustomer?.name || "Customer Profile"
                : initialCustomer
                  ? "Edit Customer Profile"
                  : "Add New Customer"}
            </h3>
            <p className="text-xs text-muted mt-0.5">
              {mode === "view"
                ? "Customer contact information, client notes, and attributes."
                : initialCustomer
                  ? "Update contact details, notes, and customer attributes."
                  : "Create a new client profile with customer attributes & notes."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {mode === "view" && initialCustomer && (
              <button
                type="button"
                onClick={() => setMode("edit")}
                className="inline-flex items-center justify-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface border border-border-hairline px-3 py-1.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer"
              >
                <Edit3 size={13} />
                <span>Edit</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 -mr-1.5 -my-1 rounded-xl text-muted hover:text-on-surface hover:bg-surface-container-high transition-all cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* VIEW MODE CONTENT */}
        {mode === "view" && (
          <div className="flex flex-col flex-1 overflow-hidden space-y-4">
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Contact Information Card */}
              <div className="bg-surface-container-low p-4 rounded-2xl border border-border-hairline shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                    Contact Overview
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      formData.isActive
                        ? "bg-tertiary-container text-on-tertiary-container border border-tertiary/20"
                        : "bg-surface-container-high text-muted border border-border-hairline"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        formData.isActive ? "bg-tertiary" : "bg-outline"
                      }`}
                    />
                    <span>{formData.isActive ? "Active" : "Inactive"}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="text-on-surface">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-0.5">
                      Email
                    </span>
                    <span className="truncate block">{formData.email || "No email on file"}</span>
                  </div>

                  <div className="text-on-surface">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-0.5">
                      Phone
                    </span>
                    <span className="truncate block">{formData.phone || "No phone on file"}</span>
                  </div>

                  {formData.company && (
                    <div className="text-on-surface sm:col-span-2">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-0.5">
                        Company
                      </span>
                      <span className="truncate block">{formData.company}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Notes Card */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface">
                  Client Notes
                </span>
                {formData.notes?.trim() ? (
                  <p className="text-xs text-on-surface whitespace-pre-line break-words bg-surface-container-low p-3.5 rounded-2xl border border-border-hairline shadow-2xs">
                    {formData.notes}
                  </p>
                ) : (
                  <p className="text-xs text-outline italic bg-surface-container-low p-3.5 rounded-2xl border border-border-hairline shadow-2xs">
                    No client notes recorded for this customer.
                  </p>
                )}
              </div>

              {/* Customer Attributes Section */}
              <CustomerAttributesEditor
                attributes={attributes}
                isViewMode={true}
                attributeError=""
                keyInputRefs={keyInputRefs}
                onAddAttributeRow={handleAddAttributeRow}
                onRemoveAttributeRow={handleRemoveAttributeRow}
                onAttributeChange={handleAttributeChange}
              />
            </div>

            {/* Modal Footer (Pinned) */}
            <div className="flex items-center justify-between pt-3 border-t border-border-hairline shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface border border-border-hairline px-5 py-2.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-2xs"
              >
                Close
              </button>

              {initialCustomer && (
                <button
                  type="button"
                  onClick={() => setMode("edit")}
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-xs"
                >
                  <Edit3 size={14} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* EDIT MODE FORM */}
        {mode === "edit" && (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden space-y-4">
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface mb-1">
                    Name *
                  </label>
                  <div className="signup-field flex items-center bg-surface-container-lowest border border-border-hairline shadow-2xs rounded-xl px-3.5 py-2 text-xs transition-all focus-within:border-primary">
                    <input
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Olivia & Liam Sterling"
                      className="w-full text-xs text-on-surface placeholder:text-outline focus:outline-hidden bg-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface mb-1">
                    Email
                  </label>
                  <div className="signup-field flex items-center bg-surface-container-lowest border border-border-hairline shadow-2xs rounded-xl px-3.5 py-2 text-xs transition-all focus-within:border-primary">
                    <input
                      type="email"
                      value={formData.email || ""}
                      onChange={e => {
                        setFormData({ ...formData, email: e.target.value });
                        if (contactError) setContactError("");
                      }}
                      placeholder="client@luxuryholding.com"
                      className="w-full text-xs text-on-surface placeholder:text-outline focus:outline-hidden bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: WhatsApp Number & Customer Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface mb-1">
                    WhatsApp Number
                  </label>
                  <div className="signup-field flex items-center bg-surface-container-lowest border border-border-hairline shadow-2xs rounded-xl px-3.5 py-2 text-xs transition-all focus-within:border-primary">
                    <input
                      value={formData.phone || ""}
                      onChange={e => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (contactError) setContactError("");
                      }}
                      placeholder="+234 800 000 0000"
                      className="w-full text-xs text-on-surface placeholder:text-outline focus:outline-hidden bg-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface mb-1">
                    Customer Status
                  </label>
                  <div className="signup-field flex items-center bg-surface-container-lowest border border-border-hairline shadow-2xs rounded-xl px-3.5 py-2 text-xs transition-all focus-within:border-primary">
                    <select
                      value={formData.isActive ? "active" : "inactive"}
                      onChange={e =>
                        setFormData({ ...formData, isActive: e.target.value === "active" })
                      }
                      className="w-full bg-transparent text-xs text-on-surface focus:outline-hidden cursor-pointer"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 3: Company (Optional) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface mb-1">
                  Company / Brand (Optional)
                </label>
                <div className="signup-field flex items-center bg-surface-container-lowest border border-border-hairline shadow-2xs rounded-xl px-3.5 py-2 text-xs transition-all focus-within:border-primary">
                  <input
                    value={formData.company || ""}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Aethel Maison"
                    className="w-full text-xs text-on-surface placeholder:text-outline focus:outline-hidden bg-transparent"
                  />
                </div>
              </div>

              {/* Row 4: Initial Service Scope (for new customer) */}
              {!initialCustomer && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-border-hairline">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface mb-1">
                      Initial Service Needed
                    </label>
                    <div className="signup-field flex items-center bg-surface-container-lowest border border-border-hairline shadow-2xs rounded-xl px-3.5 py-2 text-xs transition-all focus-within:border-primary">
                      <select
                        value={formData.service}
                        onChange={e => setFormData({ ...formData, service: e.target.value })}
                        className="w-full bg-transparent text-xs text-on-surface focus:outline-hidden cursor-pointer"
                      >
                        {AVAILABLE_SERVICES.map(svc => (
                          <option key={svc} value={svc}>
                            {svc}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface mb-1">
                      Amount Budget (₦)
                    </label>
                    <div className="signup-field flex items-center bg-surface-container-lowest border border-border-hairline shadow-2xs rounded-xl px-3.5 py-2 text-xs transition-all focus-within:border-primary">
                      <input
                        type="number"
                        step="1000"
                        min="0"
                        value={formData.amount || ""}
                        onChange={e =>
                          setFormData({ ...formData, amount: Number(e.target.value) || 0 })
                        }
                        placeholder="0"
                        className="w-full text-xs text-on-surface font-mono focus:outline-hidden bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Row 5: Client Notes */}
              <div className="pt-2 border-t border-border-hairline">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface mb-1">
                  Client Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes || ""}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Specific preferences, styling requests, delivery instructions..."
                  className="w-full text-xs text-on-surface placeholder:text-outline bg-surface-container-lowest border border-border-hairline shadow-2xs rounded-xl p-3 focus:outline-hidden focus:border-primary transition-all resize-none"
                />
              </div>

              {/* Row 6: Customer Attributes (Controlled Two-Input UI) */}
              <CustomerAttributesEditor
                attributes={attributes}
                isViewMode={false}
                attributeError={attributeError}
                keyInputRefs={keyInputRefs}
                onAddAttributeRow={handleAddAttributeRow}
                onRemoveAttributeRow={handleRemoveAttributeRow}
                onAttributeChange={handleAttributeChange}
              />

              {/* Error Banners */}
              {contactError && (
                <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-xl text-xs text-error font-medium">
                  <AlertCircle size={14} className="shrink-0 text-error" />
                  <span>{contactError}</span>
                </div>
              )}

              {attributeError && (
                <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-xl text-xs text-error font-medium">
                  <AlertCircle size={14} className="shrink-0 text-error" />
                  <span>{attributeError}</span>
                </div>
              )}
            </div>

            {/* Modal Footer (Pinned) */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-hairline shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (initialCustomer) {
                    setMode("view");
                  } else {
                    onClose();
                  }
                }}
                className="inline-flex items-center justify-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface border border-border-hairline px-5 py-2.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-2xs"
              >
                {initialCustomer ? "Back to Profile" : "Cancel"}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving…</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>{initialCustomer ? "Update Customer" : "Save Customer"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
