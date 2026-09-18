"use client";

import { CheckCircle2, Loader2, MessageCircle, MessageSquare, Send, X } from "lucide-react";
import { useState } from "react";
import { submitFeatureRequest } from "@/services/api";

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [view, setView] = useState<"menu" | "request">("menu");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!title.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      await submitFeatureRequest({
        title: title.trim(),
        description: title.trim(),
        category: "other",
        email: email.trim(),
      });
      setIsSubmitted(true);
      setTitle("");
      setEmail("");
    } catch {
      // Handled
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside aria-label="Chat and Feedback" className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Trigger */}
      {!isOpen && (
        <div className="flex items-center gap-2.5">
          {showBadge && (
            <div className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-card border border-border-hairline rounded-full shadow-md text-xs text-on-surface font-medium">
              <span onClick={() => setIsOpen(true)} className="cursor-pointer hover:text-primary">
                Let&apos;s Chat
              </span>
              <button
                type="button"
                onClick={() => setShowBadge(false)}
                className="text-text-muted hover:text-on-surface p-0.5"
                aria-label="Dismiss chat prompt"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open chat"
            className="w-12 h-12 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <MessageSquare size={18} />
          </button>
        </div>
      )}

      {/* Clean & Simple Popup Card */}
      {isOpen && (
        <div className="w-[320px] sm:w-[360px] bg-card rounded-2xl border border-border-hairline shadow-2xl p-5 flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
            <strong className="text-sm font-bold text-on-surface">
              {view === "request" ? "Request a Feature" : "How can we help?"}
            </strong>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setView("menu");
                setIsSubmitted(false);
              }}
              aria-label="Close"
              className="text-text-muted hover:text-on-surface p-1 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Menu View */}
          {view === "menu" && (
            <div className="space-y-2.5">
              <a
                href="https://wa.me/2348003526847?text=Hi%20Shopwus%20Team%2C%20I%20have%20a%20question"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold transition-colors"
              >
                <MessageCircle size={16} />
                <span>Chat on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setView("request")}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border-hairline hover:bg-surface-container-low text-on-surface text-xs font-semibold transition-colors text-left cursor-pointer"
              >
                <Send size={15} className="text-primary" />
                <span>Suggest a Feature / Feedback</span>
              </button>
            </div>
          )}

          {/* Feature Request View */}
          {view === "request" && (
            <div>
              {isSubmitted ? (
                <div className="text-center py-4 space-y-2">
                  <CheckCircle2 size={24} className="text-tertiary mx-auto" />
                  <p className="text-xs font-semibold text-on-surface">Thanks for your feedback!</p>
                  <p className="text-[11px] text-on-surface-variant">
                    Our team reviews every submission.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setView("menu");
                    }}
                    className="text-xs text-primary underline font-medium pt-2"
                  >
                    Back to options
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <textarea
                    required
                    rows={3}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Describe your idea or feature request..."
                    className="w-full text-xs p-3 rounded-xl border border-border-hairline focus:border-primary outline-none resize-none bg-surface"
                  />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-border-hairline focus:border-primary outline-none bg-surface"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setView("menu")}
                      className="text-xs text-text-muted hover:text-on-surface"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : "Send"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
