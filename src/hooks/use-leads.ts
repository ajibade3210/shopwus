"use client";

import { useMemo, useState } from "react";
import { exportLeadsCSV } from "@/services/api/leads.service";
import type { Lead, LeadFilterStatus } from "@/types";
import {
  useConvertLeadMutation,
  useDeleteLeadMutation,
  useLeadsQuery,
  useLeadsSummaryQuery,
  useUpdateLeadStatusMutation,
} from "./queries";

export function useLeads(notify?: (message: string) => void) {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadFilterStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isExporting, setIsExporting] = useState(false);

  const { data: items = [], isLoading } = useLeadsQuery(searchQuery, statusFilter);
  const { data: summary } = useLeadsSummaryQuery();
  const convertMutation = useConvertLeadMutation();
  const updateStatusMutation = useUpdateLeadStatusMutation();
  const deleteMutation = useDeleteLeadMutation();

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status: LeadFilterStatus) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await exportLeadsCSV();
      notify?.(`Lead inquiries list exported successfully (${res.count} records).`);
    } catch {
      notify?.("Failed to export leads list.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleConvertToCustomer = async (leadId: string) => {
    try {
      const { customer } = await convertMutation.mutateAsync({ id: leadId });
      setSelectedLeadId(null);
      if (customer.isExistingCustomer) {
        notify?.(`Service attached to existing customer profile: ${customer.name}.`);
      } else {
        notify?.(`Lead converted to customer and registered in directory: ${customer.name}.`);
      }
      return true;
    } catch {
      notify?.("Failed to convert lead to customer.");
      return false;
    }
  };

  const handleUpdateStatus = async (leadId: string, status: Lead["status"]) => {
    try {
      const updated = await updateStatusMutation.mutateAsync({ id: leadId, status });
      return updated;
    } catch {
      return null;
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      await deleteMutation.mutateAsync(leadId);
      setSelectedLeadId(null);
      notify?.("Lead inquiry deleted successfully.");
      return true;
    } catch {
      notify?.("Failed to delete lead inquiry.");
      return false;
    }
  };

  const handleBulkDeleteLeads = async (leadIds: string[]) => {
    if (leadIds.length === 0) return false;
    try {
      await Promise.all(leadIds.map(id => deleteMutation.mutateAsync(id)));
      setSelectedLeadId(null);
      notify?.(`${leadIds.length} lead${leadIds.length > 1 ? "s" : ""} deleted successfully.`);
      return true;
    } catch {
      notify?.("Failed to delete selected leads.");
      return false;
    }
  };

  const selectedLead = items.find(l => l.id === selectedLeadId) || null;

  const metrics = useMemo(() => {
    if (summary) return summary;
    const unconverted = items.filter(l => l.status !== "converted");
    return {
      total: unconverted.length,
      newToday: unconverted.filter(l => l.status === "new").length,
      conversion: Math.round(
        (items.filter(l => l.status === "converted").length / (items.length || 1)) * 100
      ),
    };
  }, [summary, items]);

  return {
    items,
    selectedLeadId,
    setSelectedLeadId,
    selectedLead,
    searchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    startIndex,
    paginatedItems,
    isExporting,
    isConverting: convertMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isLoading,
    metrics,
    statusFilter,
    handleStatusFilterChange,
    handleSearch,
    handleExport,
    handleConvertToCustomer,
    handleUpdateStatus,
    handleDeleteLead,
    handleBulkDeleteLeads,
  };
}
