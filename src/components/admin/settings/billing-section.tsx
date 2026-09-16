"use client";

import { AlertCircle, Check, CheckCircle2, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useBillingSummaryQuery,
  usePaystackBanksQuery,
  useResolveAccountMutation,
  useUpdatePayoutAccountMutation,
} from "@/hooks/queries";
import { formatCurrency } from "@/utils/currency";
import { StatusBadge } from "../common/status-badge";
import { Card } from "./card";

export function BillingSection() {
  const { data: summary } = useBillingSummaryQuery();
  const { data: banks = [] } = usePaystackBanksQuery();

  const resolveMutation = useResolveAccountMutation();
  const updatePayoutMutation = useUpdatePayoutAccountMutation();

  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [resolvedAccountName, setResolvedAccountName] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const billing = summary?.billing;
  const stats = summary?.stats;
  const transactions = summary?.transactions || [];

  useEffect(() => {
    if (billing?.bankCode) setSelectedBankCode(billing.bankCode);
    if (billing?.accountNumber) setAccountNumber(billing.accountNumber);
    if (billing?.accountName) setResolvedAccountName(billing.accountName);
  }, [billing]);

  const performAccountResolution = async (acc: string, bank: string) => {
    if (acc.length !== 10 || !bank) return;
    setIsResolving(true);
    setResolveError(null);

    try {
      const res = await resolveMutation.mutateAsync({
        accountNumber: acc,
        bankCode: bank,
      });
      setResolvedAccountName(res.account_name);
    } catch (err: unknown) {
      setResolvedAccountName(null);
      const msg = err instanceof Error ? err.message : "";
      if (msg.toLowerCase().includes("timeout") || msg.toLowerCase().includes("network")) {
        setResolveError("Interbank network (NIBSS) is currently slow. Please click Retry below.");
      } else {
        setResolveError(msg || "Could not verify account name. Please check details.");
      }
    } finally {
      setIsResolving(false);
    }
  };

  const handleAccountNumberChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    setAccountNumber(cleaned);
    setResolveError(null);
    setResolvedAccountName(null);

    if (cleaned.length === 10 && selectedBankCode) {
      performAccountResolution(cleaned, selectedBankCode);
    }
  };

  const handleBankChange = (bankCode: string) => {
    setSelectedBankCode(bankCode);
    setResolveError(null);
    setResolvedAccountName(null);

    if (accountNumber.length === 10 && bankCode) {
      performAccountResolution(accountNumber, bankCode);
    }
  };

  const handleSavePayoutAccount = async () => {
    if (!selectedBankCode || accountNumber.length !== 10) return;
    const selectedBank = banks.find(b => b.code === selectedBankCode);
    if (!selectedBank) return;

    await updatePayoutMutation.mutateAsync({
      bankCode: selectedBankCode,
      bankName: selectedBank.name,
      accountNumber,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  return (
    <div className="space-y-6">
      <Card
        title="Payout & Settlement Bank Account"
        description="Direct automated bank settlements powered by Paystack Split Payments. Storefront sales deposit directly to your verified commercial bank account."
      >
        <div className="space-y-4 font-sans">
          {billing?.isVerified && (
            <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900">
              <Sparkles size={16} className="text-emerald-700 shrink-0" />
              <div className="flex-1">
                <span className="font-bold">Active Subaccount Linked:</span> {billing.bankName} •{" "}
                <b>{billing.accountNumber}</b> ({billing.accountName})
              </div>
              <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                Verified
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Select Your Bank *
              </label>
              <div className="relative">
                <select
                  value={selectedBankCode}
                  onChange={e => handleBankChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl font-medium"
                >
                  <option value="">-- Choose Commercial Bank --</option>
                  {banks.map((bank, index) => (
                    <option key={`${bank.code}-${bank.id ?? index}`} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                NUBAN Account Number (10 Digits) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={10}
                  placeholder="0123456789"
                  value={accountNumber}
                  onChange={e => handleAccountNumberChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl font-mono text-sm tracking-wider"
                />
                {isResolving && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-[#6b7280]">
                    <div className="animate-spin w-3 h-3 border-2 border-[#191c1d] border-t-transparent rounded-full" />
                    <span>Verifying...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {resolvedAccountName && (
              <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-medium">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>
                  Account Verified: <b>{resolvedAccountName}</b>
                </span>
              </div>
            )}

            {resolveError && (
              <div className="flex items-center justify-between text-xs text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-xl gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{resolveError}</span>
                </div>
                {accountNumber.length === 10 && selectedBankCode && (
                  <button
                    type="button"
                    onClick={() => performAccountResolution(accountNumber, selectedBankCode)}
                    className="font-bold underline hover:text-red-900 cursor-pointer shrink-0 text-[11px]"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}

            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-[#855e2e] leading-relaxed flex items-start gap-2">
              <ShieldCheck size={16} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <b>Automated Split Settlement:</b> When a buyer checks out on your storefront,
                Paystack splits the payment instantly. Your earnings deposit straight into your
                linked bank account. Delivery fees are 100% yours without platform deductions.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSavePayoutAccount}
                disabled={
                  !selectedBankCode || accountNumber.length !== 10 || updatePayoutMutation.isPending
                }
                className="px-5 py-2 bg-[#191c1d] hover:bg-black text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isSaved ? <Check size={14} /> : null}
                <span>
                  {isSaved
                    ? "Settlement Account Linked!"
                    : updatePayoutMutation.isPending
                      ? "Creating Subaccount..."
                      : "Save & Activate Subaccount"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </Card>

      <Card
        title="Settlement History & Transactions"
        description="Audit trail of verified storefront sales, platform fees, and net merchant payouts."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-[#fafaf9] border border-[#e5e7eb] rounded-2xl">
              <div className="text-[10px] uppercase font-bold text-[#6b7280]">
                Total Gross Sales
              </div>
              <div className="text-base font-sans font-bold tabular-nums text-[#191c1d] mt-0.5">
                {formatCurrency(stats?.totalVolume || 0)}
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <div className="text-[10px] uppercase font-bold text-emerald-800">
                Net Merchant Settled
              </div>
              <div className="text-base font-sans font-bold tabular-nums text-emerald-900 mt-0.5">
                {formatCurrency(stats?.totalSettled || 0)}
              </div>
            </div>

            <div className="p-3.5 bg-[#fafaf9] border border-[#e5e7eb] rounded-2xl">
              <div className="text-[10px] uppercase font-bold text-[#6b7280]">
                Platform Fees Paid
              </div>
              <div className="text-base font-sans font-bold tabular-nums text-[#191c1d] mt-0.5">
                {formatCurrency(stats?.totalPlatformFees || 0)}
              </div>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="p-8 text-center text-[#6b7280] border border-dashed border-[#e5e7eb] rounded-2xl bg-[#fafaf9]">
              <CreditCard size={28} className="mx-auto mb-2 text-[#9ca3af]" />
              <p className="text-xs font-bold text-[#191c1d]">No payment transactions yet</p>
              <p className="text-[11px] mt-0.5">
                When buyers pay on your storefront, verified split settlements will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#eee7dc] rounded-2xl overflow-hidden bg-white">
              <table className="w-full text-left text-xs text-[#191c1d] border-collapse font-sans">
                <thead>
                  <tr className="border-b border-[#eee7dc] bg-[#faf8f5] text-[#6b7280] font-bold text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-3">Order #</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Gross Total</th>
                    <th className="py-3 px-3">Net Deposited</th>
                    <th className="py-3 px-3">Fee</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0f0]">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                      <td className="py-3 px-3 font-mono font-semibold">{tx.orderNumber}</td>
                      <td className="py-3 px-3 font-medium">{tx.customerName}</td>
                      <td className="py-3 px-3 font-sans font-bold tabular-nums">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="py-3 px-3 font-sans font-bold tabular-nums text-emerald-700">
                        {formatCurrency(tx.merchantSettlement)}
                      </td>
                      <td className="py-3 px-3 font-sans tabular-nums text-[#6b7280]">
                        {formatCurrency(tx.platformFee)}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="py-3 px-3 text-right text-[#6b7280]">
                        {new Date(tx.paidAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
