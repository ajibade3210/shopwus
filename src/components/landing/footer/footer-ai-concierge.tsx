import { Sparkles, X, Zap } from "lucide-react";
import { useState } from "react";
import type { AiPrompt } from "@/types";

const AI_PROMPTS: AiPrompt[] = [
  {
    label: "Storefront Setup",
    icon: "✦",
    question: "How fast can I launch my 3D digital storefront?",
    answer:
      "You can launch your digital storefront in under 2 minutes. Add your brand logo, bio, service offerings, and social channels to instantly generate a sharable public link with an interactive 3D stationery card.",
  },
  {
    label: "Lead CRM & Intake",
    icon: "✧",
    question: "How does customer inquiry and lead capture work?",
    answer:
      "When customers visit your public storefront or scan your QR code, they can submit inquiries directly. Leads flow into your centralized CRM with budget, timeline, and contact details for instant follow-up.",
  },
  {
    label: "Invoicing & Receipts",
    icon: "◇",
    question: "Can I generate itemized invoices and digital receipts?",
    answer:
      "Yes. Create professional multi-currency invoices with customizable line items, tax/discounts, and instant downloadable PDFs. Track payment statuses and reconcile deposits automatically.",
  },
  {
    label: "Business Valuation",
    icon: "✺",
    question: "How does the valuation estimator benchmark my business?",
    answer:
      "The valuation tool applies industry-standard SDE multiples against your annual revenue run-rate, net margins, and repeat client retention to provide a realistic equity valuation range.",
  },
];

export function FooterAiConcierge() {
  const [activePrompt, setActivePrompt] = useState<AiPrompt | null>(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const handleAskCustom = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    setIsAiThinking(true);
    setCustomAnswer(null);
    setTimeout(() => {
      setIsAiThinking(false);
      setCustomAnswer(
        `Shopwus seamlessly handles ${customQuestion.toLowerCase().includes("budget") || customQuestion.toLowerCase().includes("invoice") ? "itemized multi-currency invoicing, payment tracking, and automated receipts" : customQuestion.toLowerCase().includes("customer") || customQuestion.toLowerCase().includes("lead") ? "inbound lead capture, client CRM pipelines, and 1-click WhatsApp/email broadcasting" : "digital 3D storefronts, customer CRM, invoicing, expense bookkeeping, and business valuation"} in one unified platform for modern vendors.`
      );
    }, 600);
  };

  return (
    <div className="footer-ai-section">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="footer-ai-badge">
            <Sparkles size={12} className="text-[#a87d46]" />
            <span>AI Concierge</span>
          </span>
          <span className="text-xs text-[#747878]">Ask about Shopwus</span>
        </div>
        {activePrompt && (
          <button
            type="button"
            onClick={() => {
              setActivePrompt(null);
              setCustomAnswer(null);
            }}
            className="text-xs text-[#747878] hover:text-[#191c1d] flex items-center gap-1 cursor-pointer"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      <div className="footer-prompt-chips">
        {AI_PROMPTS.map(p => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setActivePrompt(p);
              setCustomAnswer(null);
            }}
            className={`footer-prompt-chip ${activePrompt?.label === p.label ? "is-active" : ""}`}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {activePrompt && (
        <div className="footer-ai-response-box">
          <p className="text-xs font-semibold text-[#855e2e] mb-1">Q: {activePrompt.question}</p>
          <p className="text-xs text-[#444748] leading-relaxed">{activePrompt.answer}</p>
        </div>
      )}

      <form onSubmit={handleAskCustom} className="footer-ai-input-form mt-2.5">
        <div className="footer-ai-input-wrapper">
          <input
            type="text"
            placeholder="Ask AI anything about our platform…"
            value={customQuestion}
            onChange={e => setCustomQuestion(e.target.value)}
            className="footer-ai-input"
          />
          <button
            type="submit"
            disabled={isAiThinking || !customQuestion.trim()}
            className="footer-ai-send-btn"
          >
            <Zap size={13} className={isAiThinking ? "animate-pulse" : ""} />
          </button>
        </div>
      </form>

      {customAnswer && (
        <div className="footer-ai-response-box mt-2">
          <p className="text-xs text-[#444748] leading-relaxed">{customAnswer}</p>
        </div>
      )}
    </div>
  );
}
