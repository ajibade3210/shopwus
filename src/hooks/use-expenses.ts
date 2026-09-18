"use client";

import { useMemo, useState } from "react";
import { exportExpensesCSV } from "@/services/api/expense.service";
import type { Expense, ExpenseCategory, ExpenseInput } from "@/types";
import {
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
  useExpenseCategoriesQuery,
  useExpenseSummaryQuery,
  useExpensesQuery,
  useUpdateExpenseMutation,
} from "./queries";

export function useExpenses(notify?: (message: string) => void) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: expenses = [], isLoading: isLoadingExpenses } = useExpensesQuery(
    searchQuery,
    categoryFilter
  );
  const { data: summary = null, isLoading: isLoadingSummary } = useExpenseSummaryQuery();
  const { data: categories = [] } = useExpenseCategoriesQuery();

  const createMutation = useCreateExpenseMutation();
  const updateMutation = useUpdateExpenseMutation();
  const deleteMutation = useDeleteExpenseMutation();

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (cat: ExpenseCategory | "all") => {
    setCategoryFilter(cat);
    setCurrentPage(1);
  };

  const handleOpenCreate = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleSaveExpense = async (input: ExpenseInput): Promise<boolean> => {
    try {
      if (editingExpense) {
        await updateMutation.mutateAsync({ id: editingExpense.id, input });
        notify?.(`Expense updated: ${input.title}`);
      } else {
        await createMutation.mutateAsync(input);
        notify?.(`Expense logged: ${input.title}`);
      }
      handleCloseModal();
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save expense";
      notify?.(msg);
      return false;
    }
  };

  const handleDeleteExpense = async (id: string, title: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      notify?.(`Expense deleted: ${title}`);
    } catch {
      notify?.("Failed to delete expense record");
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const res = await exportExpensesCSV();
      notify?.(`Expenses exported successfully (${res.count} records).`);
    } catch {
      notify?.("Failed to export expenses.");
    } finally {
      setIsExporting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(expenses.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = useMemo(
    () => expenses.slice(startIndex, startIndex + pageSize),
    [expenses, startIndex, pageSize]
  );

  return {
    expenses,
    paginatedItems,
    summary,
    categories,
    searchQuery,
    categoryFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    startIndex,
    isModalOpen,
    editingExpense,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isExporting,
    isLoading: isLoadingExpenses || isLoadingSummary,
    handleSearch,
    handleCategoryFilter,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSaveExpense,
    handleDeleteExpense,
    handleExportCSV,
  };
}
