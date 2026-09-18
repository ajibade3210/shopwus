"use client";

import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import { useBillingSummaryQuery } from "@/hooks/queries";
import type { TransactionStatusFilter } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { Metric, MetricsGrid, PageTitle } from "./common";
import { TransactionTable } from "./transactions/transaction-table";

export function TransactionsPage() {
  const { data: summary, isLoading } = useBillingSummaryQuery();
  const stats = summary?.stats;
  const transactions = useMemo(() => summary?.transactions || [], [summary?.transactions]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isExporting, setIsExporting] = useState(false);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (s: TransactionStatusFilter) => {
    setStatusFilter(s);
    setCurrentPage(1);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
      if (!matchesStatus) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        tx.orderNumber.toLowerCase().includes(q) ||
        tx.reference.toLowerCase().includes(q) ||
        tx.customerName.toLowerCase().includes(q)
      );
    });
  }, [transactions, statusFilter, searchQuery]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = useMemo(() => {
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [filteredTransactions, startIndex, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;
    setIsExporting(true);
    try {
      const headers = [
        "Order Number",
        "Reference",
        "Customer",
        "Gross Amount (NGN)",
        "Net Settled (NGN)",
        "Platform Fee (NGN)",
        "Status",
        "Date",
      ];
      const rows = filteredTransactions.map(tx => [
        `"${tx.orderNumber}"`,
        `"${tx.reference}"`,
        `"${tx.customerName.replace(/"/g, '""')}"`,
        tx.amount,
        tx.merchantSettlement,
        tx.platformFee,
        tx.status,
        tx.paidAt ? new Date(tx.paidAt).toISOString() : "",
      ]);

      const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `transactions_export_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const actions = (
    <div className="flex items-center gap-2 sm:gap-2.5 font-sans">
      <button
        type="button"
        onClick={handleExportCSV}
        disabled={isExporting || filteredTransactions.length === 0}
        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-2.5 bg-card hover:bg-surface-low text-on-surface border border-border-hairline hover:border-border-subtle rounded-md text-xs font-semibold transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
      >
        <Download
          size={14}
          className={isExporting ? "animate-bounce text-primary" : "text-muted"}
        />
        <span>{isExporting ? "Exporting..." : "Export"}</span>
      </button>
    </div>
  );

  return (
    <section className="content font-sans">
      <PageTitle title="Transactions" action={actions} />

      {/* Top Metrics Row */}
      <MetricsGrid>
        <Metric
          label="Total gross sales"
          value={formatCurrency(stats?.totalVolume || 0)}
          detail="All time order volume"
          isLoading={isLoading}
        />
        <Metric
          label="Net merchant settled"
          value={formatCurrency(stats?.totalSettled || 0)}
          detail="Direct commercial bank payout"
          isLoading={isLoading}
        />
        <Metric
          label="Platform fees paid"
          value={formatCurrency(stats?.totalPlatformFees || 0)}
          detail="Automated processing fees"
          isLoading={isLoading}
        />
      </MetricsGrid>

      {/* Standard Register Table matching Expenses and Invoices */}
      <TransactionTable
        items={filteredTransactions}
        paginatedItems={paginatedItems}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearch={handleSearch}
        onStatusFilterChange={handleStatusFilterChange}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        startIndex={startIndex}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        isLoading={isLoading}
      />
    </section>
  );
}
