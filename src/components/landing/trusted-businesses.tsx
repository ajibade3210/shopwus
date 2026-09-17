"use client";

import { useFeaturedStudiosQuery } from "@/hooks/queries/use-studio-queries";
import type { LogoRowProps, TrustedBusinessesProps } from "@/types";

function LogoRow({ organizations, reverse = false }: LogoRowProps) {
  if (!organizations || organizations.length === 0) return null;

  // Ensure the base sequence has enough items to comfortably exceed any screen width
  let baseItems = [...organizations];
  while (baseItems.length < 8) {
    baseItems = [...baseItems, ...organizations];
  }
  // Double the base set exactly: [base, base] -> -50% translateX translates 1 full base set smoothly
  const items = [...baseItems, ...baseItems];

  return (
    <div className={`logo-marquee ${reverse ? "logo-marquee-reverse" : ""}`}>
      <div className="logo-track">
        {items.map((org, index) => (
          <a
            key={`${org.id}-${index}`}
            href={`/${org.slug}`}
            className="business-logo group"
            title={`${org.name} — ${org.eyebrow}`}
            aria-label={`View ${org.name} studio showcase`}
          >
            {org.logoUrl ? (
              <img
                src={org.logoUrl}
                alt={`${org.name} logo`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <span className="font-sans font-bold text-base tracking-wider text-on-surface-variant group-hover:text-on-surface transition-colors px-4 text-center">
                {org.name}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

export function TrustedBusinesses({ organizations: initialOrgs }: TrustedBusinessesProps = {}) {
  const { data: queryOrgs } = useFeaturedStudiosQuery();
  const orgs = (initialOrgs && initialOrgs.length > 0 ? initialOrgs : queryOrgs) || [];

  if (orgs.length === 0) {
    return null;
  }

  const midpoint = Math.ceil(orgs.length / 2);
  const rowOne = [...orgs.slice(0, midpoint), ...orgs.slice(midpoint)];
  const rowTwo = [...orgs.slice(midpoint), ...orgs.slice(0, midpoint)];

  return (
    <section className="trusted-businesses" aria-labelledby="trusted-businesses-title">
      <div className="trusted-heading">
        <h2 id="trusted-businesses-title">
          Built for ambitious online vendors & modern businesses.
        </h2>
      </div>
      <div className="marquee-viewport flex flex-col gap-3">
        <LogoRow organizations={rowOne} />
        <LogoRow organizations={rowTwo} reverse />
      </div>
    </section>
  );
}
