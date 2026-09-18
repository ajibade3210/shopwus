import type { CurrencyCode } from "./common";

export type ExpenseCategory =
  | "materials"
  | "logistics"
  | "marketing"
  | "packaging"
  | "utilities"
  | "equipment"
  | "rent"
  | "salaries"
  | "other";

export type ExpensePaymentMethod = "bank_transfer" | "cash" | "card" | "pos" | "online";

export interface Expense {
  id: string;
  businessId?: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  paymentMethod: ExpensePaymentMethod;
  notes?: string;
  receiptUrl?: string;
  currency?: CurrencyCode;
  createdAt: string;
  updatedAt?: string;
}

export interface ExpenseInput {
  id?: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  paymentMethod: ExpensePaymentMethod;
  notes?: string;
  receiptUrl?: string;
  currency?: CurrencyCode;
}

export interface ExpenseFilterState {
  searchQuery: string;
  category: ExpenseCategory | "all";
  timeframe: "all" | "this_month" | "last_month" | "this_year";
}

export interface ExpenseCategorySummary {
  category: ExpenseCategory;
  label: string;
  amount: number;
  count: number;
  percentage: number;
  color: string;
}

export interface ExpenseSummary {
  totalAmount: number;
  expenseCount: number;
  topCategory: ExpenseCategorySummary | null;
  categories: ExpenseCategorySummary[];
  averageExpense: number;
}

export interface ExpensesPageProps {
  onToast?: (msg: string) => void;
}

export interface ExpenseModalProps {
  isOpen: boolean;
  existingExpense?: Expense | null;
  onClose: () => void;
  onToast: (msg: string) => void;
  onExpenseSaved?: (expense: Expense) => void;
  onDelete?: (id: string, title: string) => Promise<void> | void;
  isDeleting?: boolean;
}

export interface ExpenseListTableProps {
  items: Expense[];
  paginatedItems: Expense[];
  searchQuery: string;
  selectedCategory: ExpenseCategory | "all";
  categories?: ExpenseCategorySummary[];
  onSearch: (query: string) => void;
  onCategoryChange: (category: ExpenseCategory | "all") => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string, title: string) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  startIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface UseExpensesOptions {
  onToast?: (msg: string) => void;
}
