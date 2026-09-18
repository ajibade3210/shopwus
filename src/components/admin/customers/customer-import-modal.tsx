"use client";

import { AlertCircle, Check, Download, FileSpreadsheet, Loader2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { downloadCustomerCSVTemplate, importCustomers } from "@/lib/api";
import type { CustomerImportModalProps, ImportCustomerRecord } from "@/types";

export function CustomerImportModal({
  isOpen,
  onClose,
  onToast,
  onImportSuccess,
}: CustomerImportModalProps) {
  const [parsedRecords, setParsedRecords] = useState<ImportCustomerRecord[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{
    imported: number;
    skipped?: Array<{ line: number; error: string }>;
  } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  // Simple, robust CSV parser handling commas, quotes, and standard headers
  const parseCSVText = (text: string): ImportCustomerRecord[] => {
    const lines = text
      .split(/\r\n|\n/)
      .map(l => l.trim())
      .filter(Boolean);
    if (lines.length < 2) return [];

    // Header detection
    const headerLine = lines[0].toLowerCase();
    const headers = headerLine.split(",").map(h => h.replace(/["']/g, "").trim());

    const nameIdx = headers.findIndex(h => h.includes("name"));
    const phoneIdx = headers.findIndex(
      h => h.includes("phone") || h.includes("tel") || h.includes("mobile")
    );
    const emailIdx = headers.findIndex(h => h.includes("email") || h.includes("mail"));
    const notesIdx = headers.findIndex(
      h => h.includes("note") || h.includes("desc") || h.includes("detail") || h.includes("comment")
    );
    const attrIdx = headers.findIndex(
      h => h.includes("attribute") || h.includes("measurement") || h.includes("custom")
    );

    const records: ImportCustomerRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Split with quotes safety
      const matches = line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
      if (!matches) continue;

      const cols = matches.map(m => {
        let val = m.startsWith(",") ? m.slice(1) : m;
        val = val.trim();
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1).replace(/""/g, '"');
        }
        return val.trim();
      });

      const name = nameIdx >= 0 ? cols[nameIdx] || "" : cols[0] || "";
      const phone = phoneIdx >= 0 ? cols[phoneIdx] || "" : cols[1] || "";
      const email = emailIdx >= 0 ? cols[emailIdx] || "" : cols[2] || "";
      const notes = notesIdx >= 0 ? cols[notesIdx] || "" : cols[3] || "";
      const attributes = attrIdx >= 0 ? cols[attrIdx] || "" : undefined;

      if (name || email || phone) {
        records.push({
          name: name || "Unnamed Client",
          phone: phone || undefined,
          email: email || "",
          notes: notes || undefined,
          attributes: attributes || undefined,
        });
      }
    }

    return records;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setParseError(null);
    setImportResult(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const content = event.target?.result as string;
        const records = parseCSVText(content);
        if (records.length === 0) {
          setParseError(
            "Could not find any valid customer records in the uploaded file. Please verify CSV columns."
          );
          setParsedRecords([]);
        } else {
          setParsedRecords(records);
        }
      } catch {
        setParseError("Error reading the file. Please ensure it is a valid CSV format.");
        setParsedRecords([]);
      } finally {
        setIsParsing(false);
      }
    };
    reader.onerror = () => {
      setParseError("Failed to read file.");
      setIsParsing(false);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (parsedRecords.length === 0) {
      onToast("No customer records selected for import.");
      return;
    }

    setIsSubmitting(true);
    setImportResult(null);
    try {
      const res = await importCustomers(parsedRecords);
      if (res.skipped && res.skipped.length > 0) {
        setImportResult({ imported: res.imported, skipped: res.skipped });
        const errorSummary = res.skipped
          .slice(0, 2)
          .map(s => `Line ${s.line}: ${s.error}`)
          .join("; ");
        const moreCount = res.skipped.length > 2 ? ` (+${res.skipped.length - 2} more)` : "";
        onToast(
          `Imported ${res.imported} customer(s). Skipped ${res.skipped.length} invalid row(s): ${errorSummary}${moreCount}`
        );
        if (onImportSuccess) onImportSuccess();
      } else {
        onToast(
          `Successfully imported ${res.imported} customer${res.imported === 1 ? "" : "s"} into register.`
        );
        if (onImportSuccess) onImportSuccess();
        onClose();
      }
    } catch {
      onToast("Failed to import customer records.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetUpload = () => {
    setParsedRecords([]);
    setFileName("");
    setParseError(null);
    setImportResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-card border border-border-hairline rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-popover overflow-hidden font-sans animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-hairline bg-surface-container-low">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Bulk Register
            </span>
            <h2 className="text-lg font-bold text-on-surface">Import Customers</h2>
            <p className="text-xs text-muted mt-0.5">
              Upload a CSV list to bulk-populate clients into your customer register.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-on-surface">
          {/* Template helper banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-surface-container-low border border-border-hairline">
            <div>
              <b className="text-xs text-on-surface block">CSV Columns Accepted:</b>
              <span className="text-[11px] text-muted">
                Name, Phone, Email, Notes, Customer Attributes
              </span>
            </div>
            <button
              type="button"
              onClick={downloadCustomerCSVTemplate}
              className="inline-flex items-center justify-center gap-1.5 bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-border-hairline px-3 py-1.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-2xs shrink-0"
            >
              <Download size={13} />
              <span>Download Template</span>
            </button>
          </div>

          {/* Skipped Rows Feedback Banner */}
          {importResult?.skipped && importResult.skipped.length > 0 && (
            <div className="p-4 rounded-2xl bg-error/10 border border-error/20 text-error space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-error">
                <AlertCircle size={15} className="shrink-0" />
                <span>
                  {importResult.imported} imported, {importResult.skipped.length} row(s) skipped due
                  to validation:
                </span>
              </div>
              <ul className="space-y-1 text-[11px] max-h-32 overflow-y-auto pl-5 list-disc">
                {importResult.skipped.map((s, idx) => (
                  <li key={`skipped-${s.line}-${idx}`}>
                    <b>Line {s.line}:</b> {s.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Upload Area */}
          {parsedRecords.length === 0 ? (
            <div className="space-y-3">
              <label className="border-2 border-dashed border-border-hairline hover:border-primary rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-surface-container-low hover:bg-surface-container-lowest transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-card border border-border-hairline group-hover:border-primary flex items-center justify-center text-primary shadow-2xs mb-3 group-hover:scale-105 transition-all">
                  {isParsing ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Upload size={20} />
                  )}
                </div>
                <b className="text-sm font-semibold text-on-surface block">
                  {isParsing ? "Reading CSV File..." : "Click or Drag CSV file here"}
                </b>
                <span className="text-xs text-muted mt-1 block">
                  Accepts .csv or .txt spreadsheets
                </span>
                <input
                  type="file"
                  accept=".csv,text/csv,text/plain"
                  onChange={handleFileUpload}
                  disabled={isParsing}
                  className="hidden"
                />
              </label>

              {parseError && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-error/10 border border-error/20 text-error text-xs">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}
            </div>
          ) : (
            /* Parsed Records Table Preview */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet size={15} className="text-tertiary" />
                  <span className="font-bold text-xs text-on-surface">
                    {parsedRecords.length} customer records ready from{" "}
                    <i className="font-normal text-muted">{fileName}</i>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={resetUpload}
                  className="text-xs text-error hover:underline font-semibold cursor-pointer"
                >
                  Choose different file
                </button>
              </div>

              <div className="border border-border-hairline rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-surface-container-low border-b border-border-hairline text-[10px] uppercase font-bold text-muted sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Phone</th>
                      <th className="py-2.5 px-3">Email</th>
                      <th className="py-2.5 px-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-hairline bg-card">
                    {parsedRecords.map((r, i) => (
                      <tr
                        key={`${r.email}-${i}`}
                        className="hover:bg-surface-container-low/50 transition-colors"
                      >
                        <td className="py-2 px-3 font-semibold text-on-surface">{r.name}</td>
                        <td className="py-2 px-3 text-muted">{r.phone || "—"}</td>
                        <td className="py-2 px-3 text-on-surface">{r.email}</td>
                        <td className="py-2 px-3 text-muted truncate max-w-[140px]">
                          {r.notes || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-border-hairline bg-surface-container-low">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-1.5 bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-border-hairline px-4 py-2.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={parsedRecords.length === 0 || isSubmitting}
            onClick={handleImport}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Importing...</span>
              </>
            ) : (
              <>
                <Check size={13} />
                <span>
                  Import{" "}
                  {parsedRecords.length > 0 ? `${parsedRecords.length} Customers` : "Customers"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
