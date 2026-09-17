"use client";

import { useEffect, useState } from "react";
import { ConfirmModal } from "@/components/shared";
import { useInvoiceForm } from "@/hooks/use-invoice-form";
import type { InvoiceModalProps } from "@/types";
import { InvoiceFormFields } from "./invoice-form-fields";
import { InvoiceModalHeader } from "./invoice-modal-header";
import { InvoicePreview } from "./invoice-preview";

export function InvoiceModal({
  initialCustomer,
  existingInvoice,
  allCustomers = [],
  isOpen,
  onClose,
  onToast,
  onInvoiceSaved,
}: InvoiceModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const [showSendEmailConfirm, setShowSendEmailConfirm] = useState(false);
  const [isResendAction, setIsResendAction] = useState(false);

  const {
    customerId,
    customerName,
    setCustomerName,
    customerEmail,
    billingAddress,
    setBillingAddress,
    issueDate,
    setIssueDate,
    dueDate,
    setDueDate,
    paymentTerms,
    setPaymentTerms,
    currency,
    setCurrency,
    items,
    discount,
    setDiscount,
    taxRate,
    setTaxRate,
    notes,
    setNotes,
    subtotal,
    taxAmount,
    total,
    isSavingDraft,
    isSending,
    isResending,
    isMarkingPaid,
    isMarkingUnpaid,
    isDeleting,
    isDownloadingPdf,
    isSendingWhatsApp,
    isCopyingLink,
    copiedLink,
    handleCustomerChange,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
    handleSaveDraft,
    handleSendInvoice,
    handleSendWhatsApp,
    handleMarkAsPaid,
    handleMarkAsUnpaid,
    handleDownloadPdf,
    handleCopyLink,
    handleResendInvoice,
    handleDeleteInvoice,
  } = useInvoiceForm({
    initialCustomer,
    existingInvoice,
    allCustomers,
    onToast,
    onInvoiceSaved,
    onClose,
  });

  if (!isOpen) return null;

  const requestSendInvoice = () => {
    if (!customerName || !customerEmail) {
      onToast("Please provide both customer name and email.");
      return;
    }
    setIsResendAction(false);
    setShowSendEmailConfirm(true);
  };

  const requestResendInvoice = () => {
    setIsResendAction(true);
    setShowSendEmailConfirm(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border-hairline rounded-3xl max-w-7xl w-full max-h-[94vh] shadow-popover overflow-hidden flex flex-col my-auto font-sans"
        onClick={e => e.stopPropagation()}
      >
        <InvoiceModalHeader
          existingInvoice={existingInvoice}
          isSavingDraft={isSavingDraft}
          isSending={isSending}
          isResending={isResending}
          isDownloadingPdf={isDownloadingPdf}
          isSendingWhatsApp={isSendingWhatsApp}
          isCopyingLink={isCopyingLink}
          isMarkingPaid={isMarkingPaid}
          isMarkingUnpaid={isMarkingUnpaid}
          isDeleting={isDeleting}
          copiedLink={copiedLink}
          onClose={onClose}
          onSaveDraft={handleSaveDraft}
          onSendInvoice={requestSendInvoice}
          onResendInvoice={requestResendInvoice}
          onDownloadPdf={handleDownloadPdf}
          onSendWhatsApp={handleSendWhatsApp}
          onCopyLink={handleCopyLink}
          onMarkAsPaid={handleMarkAsPaid}
          onMarkAsUnpaid={handleMarkAsUnpaid}
          onDeleteInvoice={handleDeleteInvoice}
        />

        <ConfirmModal
          isOpen={showSendEmailConfirm}
          onClose={() => setShowSendEmailConfirm(false)}
          onConfirm={async () => {
            setShowSendEmailConfirm(false);
            if (isResendAction) {
              await handleResendInvoice();
            } else {
              await handleSendInvoice();
            }
          }}
          title={isResendAction ? "Resend Invoice via Email" : "Send Invoice via Email"}
          description={`Are you sure you want to send this invoice to ${customerEmail || customerName}? An email containing invoice details and the direct payment link will be sent.`}
          confirmLabel={isResendAction ? "Resend Email" : "Send Email"}
          isLoading={isSending || isResending}
        />

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <InvoiceFormFields
                customerId={customerId}
                customerName={customerName}
                customerEmail={customerEmail}
                billingAddress={billingAddress}
                issueDate={issueDate}
                dueDate={dueDate}
                paymentTerms={paymentTerms}
                currency={currency}
                items={items}
                discount={discount}
                taxRate={taxRate}
                total={total}
                notes={notes}
                allCustomers={allCustomers}
                setCustomerName={setCustomerName}
                setBillingAddress={setBillingAddress}
                setIssueDate={setIssueDate}
                setDueDate={setDueDate}
                setPaymentTerms={setPaymentTerms}
                setCurrency={setCurrency}
                setDiscount={setDiscount}
                setTaxRate={setTaxRate}
                setNotes={setNotes}
                handleCustomerChange={handleCustomerChange}
                handleItemChange={handleItemChange}
                handleAddItem={handleAddItem}
                handleRemoveItem={handleRemoveItem}
              />
            </div>

            <InvoicePreview
              existingInvoice={existingInvoice}
              customerName={customerName}
              billingAddress={billingAddress}
              issueDate={issueDate}
              dueDate={dueDate}
              paymentTerms={paymentTerms}
              currency={currency}
              items={items}
              subtotal={subtotal}
              discount={discount}
              taxRate={taxRate}
              taxAmount={taxAmount}
              total={total}
              notes={notes}
              copiedLink={copiedLink}
              onCopyLink={handleCopyLink}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
