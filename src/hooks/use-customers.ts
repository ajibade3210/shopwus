"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { queryKeys } from "@/lib/query-keys";
import { exportCustomersCSV } from "@/services/api/customer.service";
import type { NewCustomerInput, ServiceStatus } from "@/types";
import {
  useAddCustomerServiceMutation,
  useCreateCustomerMutation,
  useCustomersQuery,
  useCustomersSummaryQuery,
  useDeleteCustomerMutation,
  useDeleteCustomerServiceMutation,
  useDeleteInvoiceMutation,
  useInvoicesQuery,
  useResendInvoiceMutation,
  useToggleCustomerStatusMutation,
  useUpdateCustomerMutation,
  useUpdateCustomerServiceStatusMutation,
} from "./queries";

export const AVAILABLE_SERVICES = [
  "Full Wedding Production & Styling",
  "Corporate Galas & Summits",
  "Private Dinners & Floral Scenography",
  "VIP Concierge Production",
  "Bespoke Atelier Styling",
  "Brand Activations & Ephemeral Lounges",
] as const;

export function useCustomers(onToast?: (message: string) => void) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isExporting, setIsExporting] = useState(false);

  const queryClient = useQueryClient();
  const { data: customersData = [], isLoading: isLoadingCustomers } =
    useCustomersQuery(searchQuery);
  const { data: summary } = useCustomersSummaryQuery();
  const { data: invoicesData = [], isLoading: isLoadingInvoices } = useInvoicesQuery();

  const createCustomerMutation = useCreateCustomerMutation();
  const updateCustomerMutation = useUpdateCustomerMutation();
  const addServiceMutation = useAddCustomerServiceMutation();
  const deleteServiceMutation = useDeleteCustomerServiceMutation();
  const updateServiceStatusMutation = useUpdateCustomerServiceStatusMutation();
  const toggleStatusMutation = useToggleCustomerStatusMutation();
  const resendInvoiceMutation = useResendInvoiceMutation();
  const deleteInvoiceMutation = useDeleteInvoiceMutation();
  const deleteCustomerMutation = useDeleteCustomerMutation();

  const items = customersData;
  const invoices = invoicesData;

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const reloadCustomers = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await exportCustomersCSV();
      onToast?.(`Customer list exported successfully (${res.count} records).`);
    } catch {
      onToast?.("Failed to export customer list.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreateCustomer = async (formData: NewCustomerInput) => {
    if (!formData.name?.trim()) {
      onToast?.("Please enter customer name.");
      return false;
    }

    if (!formData.email?.trim() && !formData.phone?.trim()) {
      onToast?.("Please provide at least one contact method (Email or Phone/WhatsApp number).");
      return false;
    }

    try {
      const newCustomer = await createCustomerMutation.mutateAsync(formData);
      onToast?.(`Customer "${newCustomer.name}" added successfully.`);
      return true;
    } catch {
      onToast?.("Failed to create customer.");
      return false;
    }
  };

  const handleUpdateCustomer = async (id: string, formData: Partial<NewCustomerInput>) => {
    if (!formData.name?.trim()) {
      onToast?.("Please enter customer name.");
      return false;
    }

    if (!formData.email?.trim() && !formData.phone?.trim()) {
      onToast?.("Please provide at least one contact method (Email or Phone/WhatsApp number).");
      return false;
    }

    try {
      const updated = await updateCustomerMutation.mutateAsync({ id, input: formData });
      onToast?.(`Customer "${updated.name}" updated successfully.`);
      return true;
    } catch {
      onToast?.("Failed to update customer.");
      return false;
    }
  };

  const handleAddService = async (
    customerId: string,
    customerName: string,
    data: { name: string; service: string; amount: number; status: ServiceStatus }
  ) => {
    if (!data.name) {
      onToast?.("Service name is required.");
      return false;
    }

    try {
      await addServiceMutation.mutateAsync({
        customerId,
        input: {
          name: data.name,
          service: data.service,
          amount: data.amount,
          status: data.status,
        },
      });
      onToast?.(`Service scope added for ${customerName}.`);
      return true;
    } catch {
      onToast?.("Failed to add service scope.");
      return false;
    }
  };

  const handleDeleteService = async (customerId: string, serviceId: string) => {
    try {
      await deleteServiceMutation.mutateAsync({ customerId, serviceId });
      onToast?.("Service scope removed.");
      return true;
    } catch {
      onToast?.("Failed to remove service scope.");
      return false;
    }
  };

  const handleUpdateServiceStatus = async (
    customerId: string,
    serviceId: string,
    status: ServiceStatus
  ) => {
    try {
      await updateServiceStatusMutation.mutateAsync({ customerId, serviceId, status });
      onToast?.(`Service status updated to ${status}.`);
      return true;
    } catch {
      onToast?.("Failed to update service status.");
      return false;
    }
  };

  const handleToggleCustomerStatus = async (customerId: string, isActive: boolean) => {
    try {
      const updated = await toggleStatusMutation.mutateAsync({ id: customerId, isActive });
      onToast?.(`Customer "${updated.name}" is now ${isActive ? "Active" : "Archived"}.`);
      return true;
    } catch {
      onToast?.("Failed to update customer status.");
      return false;
    }
  };

  const handleResendInvoice = async (invoiceId: string) => {
    try {
      const res = await resendInvoiceMutation.mutateAsync(invoiceId);
      onToast?.(`Invoice #${res.invoiceNumber} resent to ${res.customerEmail}.`);
      return true;
    } catch {
      onToast?.("Failed to resend invoice.");
      return false;
    }
  };

  const handleDeleteDraftInvoice = async (invoiceId: string) => {
    try {
      await deleteInvoiceMutation.mutateAsync(invoiceId);
      onToast?.("Draft invoice deleted.");
      return true;
    } catch {
      onToast?.("Failed to delete draft invoice.");
      return false;
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      await deleteCustomerMutation.mutateAsync(customerId);
      setSelectedCustomerId(null);
      onToast?.("Customer deleted successfully.");
      return true;
    } catch {
      onToast?.("Failed to delete customer.");
      return false;
    }
  };

  const handleBulkDeleteCustomers = async (customerIds: string[]) => {
    if (customerIds.length === 0) return false;
    try {
      await Promise.all(customerIds.map(id => deleteCustomerMutation.mutateAsync(id)));
      setSelectedCustomerId(null);
      onToast?.(`${customerIds.length} customers deleted successfully.`);
      return true;
    } catch {
      onToast?.("Failed to delete selected customers.");
      return false;
    }
  };

  const selectedCustomer = items.find(c => c.id === selectedCustomerId) || null;
  const customerInvoices = selectedCustomer
    ? invoices.filter(
        inv =>
          inv.customerId === selectedCustomer.id || inv.customerEmail === selectedCustomer.email
      )
    : [];

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);
  const totalCustomers = summary?.total ?? items.length;
  const totalRevenue =
    summary?.totalRevenue ?? items.reduce((acc, c) => acc + (c.totalRevenue || 0), 0);
  const activeServicesCount =
    summary?.activeServicesCount ??
    items.reduce((acc, c) => acc + c.services.filter(s => s.status === "active").length, 0);

  return {
    items,
    invoices,
    selectedCustomerId,
    setSelectedCustomerId,
    selectedCustomer,
    customerInvoices,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    startIndex,
    paginatedItems,
    totalCustomers,
    totalRevenue,
    activeServicesCount,
    isExporting,
    isSubmitting: createCustomerMutation.isPending || updateCustomerMutation.isPending,
    isDeletingCustomer: deleteCustomerMutation.isPending,
    isLoading: isLoadingCustomers || isLoadingInvoices,
    handleSearch,
    reloadCustomers,
    handleExport,
    handleCreateCustomer,
    handleUpdateCustomer,
    handleAddService,
    handleDeleteService,
    handleUpdateServiceStatus,
    handleToggleCustomerStatus,
    handleResendInvoice,
    handleDeleteDraftInvoice,
    handleDeleteCustomer,
    handleBulkDeleteCustomers,
  };
}
