import { Star, X } from "lucide-react";
import type { ReviewModalProps } from "@/types";

export function ReviewModal({
  isOpen,
  onClose,
  reviewForm,
  setReviewForm,
  reviewSubmitting,
  onSubmit,
  primaryColor,
  buttonColor,
  radiusClass,
}: ReviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border-hairline rounded-3xl max-w-md w-full p-8 shadow-popover relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-outline hover:text-on-surface p-1 cursor-pointer transition-colors"
          aria-label="Close review dialog"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <span
            style={{ color: primaryColor }}
            className="text-[10px] uppercase tracking-[0.18em] font-semibold"
          >
            Client Voices
          </span>
          <h3 className="font-serif text-2xl text-on-surface font-normal mt-1">
            Leave a Testimonial
          </h3>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-on-surface-variant font-medium mb-1">Your Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Folashade Adeleke"
              value={reviewForm.author}
              onChange={e => setReviewForm({ ...reviewForm, author: e.target.value })}
              className="w-full bg-surface-lowest border border-border-hairline rounded-lg px-3.5 py-2.5 text-xs text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-on-surface-variant font-medium mb-1">Event Type</label>
            <input
              type="text"
              placeholder="e.g. Wedding, Milestone Gala, Corporate"
              value={reviewForm.eventType}
              onChange={e => setReviewForm({ ...reviewForm, eventType: e.target.value })}
              className="w-full bg-surface-lowest border border-border-hairline rounded-lg px-3.5 py-2.5 text-xs text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-on-surface-variant font-medium mb-1">Rating</label>
            <div className="flex gap-2 items-center py-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  className="p-1 text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    size={20}
                    className={
                      star <= reviewForm.rating
                        ? "fill-amber-500 text-amber-500"
                        : "text-border-hairline"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-on-surface-variant font-medium mb-1">
              Your Review / Experience
            </label>
            <textarea
              rows={3}
              required
              placeholder="Tell us about the artistry, communication, and execution..."
              value={reviewForm.comment}
              onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
              className="w-full bg-surface-lowest border border-border-hairline rounded-lg p-3.5 text-xs text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={reviewSubmitting}
              style={{ backgroundColor: buttonColor }}
              className={`w-full text-white text-xs font-medium py-3 shadow-sm transition-all cursor-pointer ${radiusClass}`}
            >
              {reviewSubmitting ? "Submitting..." : "Submit Testimonial"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
