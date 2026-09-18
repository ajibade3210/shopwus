"use client";

import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MAX_CATEGORY_NAME_LENGTH, MAX_PORTFOLIO_CATEGORIES } from "@/constants";
import type { CategoryDropdownProps } from "@/types";

export function CategoryDropdown({
  value,
  onChange,
  categories,
  onAddCategory,
  onRemoveCategory,
  label = "Category",
  placeholder = "Select Category",
  maxCategories = MAX_PORTFOLIO_CATEGORIES,
  size = "md",
  labelClassName,
  buttonClassName,
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newCatInput, setNewCatInput] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleAdd = () => {
    const trimmed = newCatInput.trim();
    if (trimmed) {
      onAddCategory(trimmed);
      onChange(trimmed);
      setNewCatInput("");
    }
  };

  const defaultLabelClass =
    size === "sm"
      ? "text-[11px] font-semibold text-[#374151] uppercase tracking-wide block mb-1"
      : "block text-[#1f2937] font-medium text-xs mb-1";

  const defaultButtonClass =
    size === "sm"
      ? "w-full bg-white border border-[#d1d5db] rounded-lg px-3 py-1.5 text-xs text-[#111827] focus:outline-none flex items-center justify-between cursor-pointer hover:border-[#9ca3af] transition-colors h-[32px]"
      : "w-full bg-white border border-[#e5e7eb] rounded-lg px-3.5 py-2.5 text-xs text-[#191c1d] focus:outline-none flex items-center justify-between cursor-pointer hover:border-[#d1d5db] transition-colors h-[38px]";

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className={labelClassName || defaultLabelClass}>
          {label} ({categories.length}/{maxCategories})
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={buttonClassName || defaultButtonClass}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="font-medium truncate">{value || placeholder}</span>
        <ChevronDown
          size={14}
          className={`text-[#6b7280] transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e5e7eb] rounded-xl shadow-xl z-50 p-2 space-y-2 animate-fade-in">
          <div className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider px-2 py-0.5 flex items-center justify-between">
            <span>Select Category</span>
            <span className="font-normal font-mono">
              {categories.length}/{maxCategories}
            </span>
          </div>

          <div className="space-y-1 max-h-44 overflow-y-auto">
            {categories.map(cat => {
              const isSelected = value === cat;
              return (
                <div
                  key={cat}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    isSelected
                      ? "bg-[#eff6ff] text-[#0058be] font-semibold"
                      : "hover:bg-[#f9fafb] text-[#374151]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onChange(cat);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 flex-1 text-left cursor-pointer min-w-0 pr-2"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isSelected ? "bg-[#0058be]" : "bg-transparent"
                      }`}
                    />
                    <span className="truncate">{cat}</span>
                  </button>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onRemoveCategory(cat);
                    }}
                    disabled={categories.length <= 1}
                    className="text-[#9ca3af] hover:text-[#ba1a1a] p-1 rounded hover:bg-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                    title="Delete category"
                    aria-label={`Delete category ${cat}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add New Category Section */}
          {categories.length < maxCategories ? (
            <div className="pt-2 border-t border-[#f3f4f6]">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  maxLength={MAX_CATEGORY_NAME_LENGTH}
                  placeholder={`New category (max ${MAX_CATEGORY_NAME_LENGTH} chars)...`}
                  value={newCatInput}
                  onChange={e => setNewCatInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAdd();
                    }
                  }}
                  className="flex-1 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg px-2.5 py-1 text-xs text-[#191c1d] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!newCatInput.trim()}
                  className="dark-button !text-xs !py-1 !px-2.5 rounded-lg disabled:opacity-40 shrink-0"
                >
                  <Plus size={11} /> Add
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-1.5 border-t border-[#f3f4f6] text-[10px] text-[#9ca3af] text-center italic">
              Category capacity reached ({maxCategories}/{maxCategories})
            </div>
          )}
        </div>
      )}
    </div>
  );
}
