import { ArrowRight, Tag } from "lucide-react";
import {
  BUSINESS_TYPE_SERVICE_ACTION,
  BUSINESS_TYPE_SERVICES_SECTION_TITLE,
  DEFAULT_BUSINESS_TYPE,
} from "@/constants";
import type { StudioServicesSectionProps } from "@/types";
import { formatServicePrice } from "@/utils/currency";
import { isDarkColor } from "@/utils/helpers";

export function StudioServicesSection({
  profile,
  setQuoteModalOpen,
  setQuoteForm,
  primaryColor,
  secondaryColor: _secondaryColor,
  buttonColor: _buttonColor,
  textColor,
  radiusClass: _radiusClass,
}: StudioServicesSectionProps) {
  const services = profile.services || [];

  return (
    <section id="services" className="scroll-mt-24">
      <div className="mb-8">
        <h2 style={{ color: textColor }} className="font-serif text-2xl sm:text-3xl font-normal">
          {BUSINESS_TYPE_SERVICES_SECTION_TITLE[profile.businessType ?? DEFAULT_BUSINESS_TYPE]}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service, idx) => {
          const formattedPrice = formatServicePrice(service, profile.currency || "NGN");

          return (
            <div
              key={service.id || idx}
              className="bg-card border border-border-hairline rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-card hover:shadow-md transition-all group"
            >
              <div>
                <div className="mb-3.5 flex items-center justify-between gap-2 flex-wrap">
                  <span
                    style={{
                      backgroundColor: `${primaryColor}14`,
                      color: isDarkColor(primaryColor) ? primaryColor : undefined,
                      borderColor: `${primaryColor}28`,
                    }}
                    className={`text-[10px] font-semibold uppercase tracking-[0.14em] px-3 py-1 rounded-full border inline-block shadow-2xs ${
                      !isDarkColor(primaryColor) ? "text-on-surface" : ""
                    }`}
                  >
                    {service.category || ""}
                  </span>

                  {formattedPrice && (
                    <span className="text-xs font-bold text-on-surface bg-surface-low border border-border-hairline px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
                      <Tag size={11} className="text-outline" />
                      {formattedPrice}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg sm:text-xl text-on-surface font-normal mb-2 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>

                <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                  {service.description ||
                    "Comprehensive design, vendor curation, on-site choreography, and bespoke styling tailored to your aesthetic vision."}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setQuoteForm(prev => ({
                      ...prev,
                      service: service.name,
                    }));
                    setQuoteModalOpen(true);
                  }}
                  style={{ color: primaryColor }}
                  className="text-xs font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>
                    {BUSINESS_TYPE_SERVICE_ACTION[profile.businessType ?? DEFAULT_BUSINESS_TYPE]}
                  </span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
