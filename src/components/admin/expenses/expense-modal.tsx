"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_CONFIG, EXPENSE_PAYMENT_METHODS } from "@/constants";
import { createExpense, updateExpense } from "@/lib/api";
import type {
  ExpenseCategory,
  ExpenseInput,
  ExpenseModalProps,
  ExpensePaymentMethod,
} from "@/types";

export function ExpenseModal({
  isOpen,
  existingExpense,
  onClose,
  onToast,
  onExpenseSaved,
}: ExpenseModalProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState<ExpenseCategory>("materials");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState<ExpensePaymentMethod>("bank_transfer");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  useEffect(() => {
    if (existingExpense) {
      setTitle(existingExpense.title);
      setAmount(existingExpense.amount);
      setCategory(existingExpense.category);
      setDate(existingExpense.date);
      setPaymentMethod(existingExpense.paymentMethod);
      setNotes(existingExpense.notes || "");
    } else {
      setTitle("");
      setAmount("");
      setCategory("materials");
      setDate(new Date().toISOString().split("T")[0]);
      setPaymentMethod("bank_transfer");
      setNotes("");
    }
    setError("");
  }, [existingExpense]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a title for the expense.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const payload: ExpenseInput = {
      title: title.trim(),
      amount: Number(amount),
      category,
      date,
      paymentMethod,
      notes: notes.trim(),
      currency: "NGN",
    };

    try {
      if (existingExpense) {
        const updated = await updateExpense(existingExpense.id, payload);
        onToast("Expense updated successfully.");
        onExpenseSaved?.(updated);
      } else {
        const created = await createExpense(payload);
        onToast("Expense logged successfully.");
        onExpenseSaved?.(created);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save expense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-card border border-border-hairline rounded-3xl w-full max-w-lg shadow-popover overflow-hidden animate-in zoom-in-95 duration-200 font-sans"
        role="dialog"
        aria-modal="true"
        aria-labelledby="expense-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-hairline">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
              Financial Record
            </span>
            <h2 id="expense-modal-title" className="text-lg font-bold text-on-surface">
              {existingExpense ? "Edit Expense" : "Log Business Expense"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-muted hover:text-on-surface transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-600 font-medium">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="expense-title"
              className="block text-xs font-semibold text-on-surface mb-1.5"
            >
              Expense Title / Description *
            </label>
            <input
              id="expense-title"
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Bulk Velvet Fabric, Instagram Ads Drop, Packaging Boxes"
              className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-border-hairline rounded-xl text-xs text-on-surface placeholder:text-muted focus:outline-hidden focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="expense-amount"
                className="block text-xs font-semibold text-on-surface mb-1.5"
              >
                Amount (₦) *
              </label>
              <input
                id="expense-amount"
                type="number"
                min="1"
                step="any"
                required
                value={amount}
                onChange={e => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="25000"
                className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-border-hairline rounded-xl text-xs font-mono text-on-surface placeholder:text-muted focus:outline-hidden focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="expense-category"
                className="block text-xs font-semibold text-on-surface mb-1.5"
              >
                Category *
              </label>
              <select
                id="expense-category"
                value={category}
                onChange={e => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-border-hairline rounded-xl text-xs text-on-surface focus:outline-hidden focus:border-primary transition-colors cursor-pointer"
              >
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {EXPENSE_CATEGORY_CONFIG[cat]?.label || cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="expense-date"
                className="block text-xs font-semibold text-on-surface mb-1.5"
              >
                Date *
              </label>
              <input
                id="expense-date"
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-border-hairline rounded-xl text-xs text-on-surface focus:outline-hidden focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="expense-payment-method"
                className="block text-xs font-semibold text-on-surface mb-1.5"
              >
                Payment Method *
              </label>
              <select
                id="expense-payment-method"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as ExpensePaymentMethod)}
                className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-border-hairline rounded-xl text-xs text-on-surface focus:outline-hidden focus:border-primary transition-colors cursor-pointer"
              >
                {Object.entries(EXPENSE_PAYMENT_METHODS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="expense-notes"
              className="block text-xs font-semibold text-on-surface mb-1.5"
            >
              Additional Notes (Optional)
            </label>
            <textarea
              id="expense-notes"
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Supplier name, invoice receipt number, delivery destination..."
              className="w-full px-3.5 py-2 bg-surface-container-lowest border border-border-hairline rounded-xl text-xs text-on-surface placeholder:text-muted focus:outline-hidden focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-hairline">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-hover px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : existingExpense ? "Update Expense" : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
