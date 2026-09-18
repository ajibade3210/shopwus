import type { CurrencyCode, FormatMoneyOptions } from "@/types";

export type { CurrencyCode, FormatMoneyOptions };

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

const DEFAULT_CURRENCY: CurrencyCode = "NGN";
const DEFAULT_LOCALE = "en-US";
const FALLBACK_ZERO = "0";

const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
  NGN: "en-NG",
  USD: "en-US",
  GBP: "en-GB",
  EUR: "en-IE",
};

export const formatMoney = (
  n: number,
  currency: CurrencyCode = DEFAULT_CURRENCY,
  options?: FormatMoneyOptions
): string => {
  if (!Number.isFinite(n)) {
    return `${CURRENCY_SYMBOLS[currency] ?? ""}${FALLBACK_ZERO}`;
  }

  const locale = CURRENCY_LOCALES[currency] ?? DEFAULT_LOCALE;
  const decimals = options?.decimals ?? (Math.abs(n) > 0 ? 2 : 0);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(n);
};

export const formatCurrency = formatMoney;

export const formatCompactMoney = (
  n: number,
  currency: CurrencyCode = DEFAULT_CURRENCY
): string => {
  const sym = CURRENCY_SYMBOLS[currency] ?? "₦";
  if (!Number.isFinite(n) || n === 0) return `${sym}0`;
  const abs = Math.abs(n);
  if (abs >= 1_000_000) {
    const val = (n / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return `${sym}${val}M`;
  }
  if (abs >= 1_000) {
    const val = (n / 1_000).toFixed(1).replace(/\.0$/, "");
    return `${sym}${val}K`;
  }
  return `${sym}${n}`;
};

export const formatServicePrice = (
  service: {
    price?: number | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    priceType?: "fixed" | "range" | string | null;
  },
  currency: CurrencyCode | string = DEFAULT_CURRENCY
): string | null => {
  const code = (currency || DEFAULT_CURRENCY) as CurrencyCode;
  const sym = CURRENCY_SYMBOLS[code] ?? "₦";

  if (service.priceType === "range" || (service.minPrice && service.maxPrice)) {
    const min = service.minPrice ?? service.price;
    const max = service.maxPrice;
    if (min && max) {
      return `${sym}${Number(min).toLocaleString()} – ${sym}${Number(max).toLocaleString()}`;
    }
    if (min) {
      return `From ${sym}${Number(min).toLocaleString()}`;
    }
    if (max) {
      return `Up to ${sym}${Number(max).toLocaleString()}`;
    }
  }

  if (service.price !== undefined && service.price !== null && Number(service.price) > 0) {
    return `${sym}${Number(service.price).toLocaleString()}`;
  }

  return null;
};
