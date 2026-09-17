import { Check } from "lucide-react";
import { GoogleIcon } from "@/components/shared/icons";
import type { ProfileSecurityCardProps } from "@/types";

export function ProfileSecurityCard({ email }: ProfileSecurityCardProps) {
  return (
    <div className="bg-card border border-border-hairline rounded-xl p-4 sm:p-6 lg:p-8 shadow-card">
      <div className="border border-border-hairline bg-surface-low rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-card border border-border-hairline flex items-center justify-center shrink-0 shadow-2xs">
            <GoogleIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <strong className="text-xs text-on-surface font-semibold">
                Google Account Active
              </strong>
              <span className="inline-flex items-center gap-1 text-[10px] bg-[#ebf8f2] text-[#2d8a74] border border-[#81efd2]/40 px-2 py-0.5 rounded-full font-medium">
                <Check size={10} /> Verified
              </span>
            </div>
            <span className="text-xs text-on-surface-variant font-mono mt-0.5 block">
              {email || "director@elanatelier.com"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
