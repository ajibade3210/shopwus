import Image from "next/image";
import Link from "next/link";
import { APP_CONFIG } from "@/constants";
import type { BrandLogoProps } from "@/types";
import { cn } from "@/utils";

export function BrandLogo({
  monogram: _monogram = "Ś",
  name = APP_CONFIG.name,
  subtitle,
  size = "md",
  theme: _theme = "dark",
  href = "/",
  className,
  monogramClassName,
  textClassName,
}: BrandLogoProps) {
  const sizeClasses = {
    sm: {
      box: "w-7 h-7 min-w-[28px] min-h-[28px]",
      imageSize: 28,
      text: "text-base font-bold",
      sub: "text-[10px]",
      gap: "gap-2.5",
    },
    md: {
      box: "w-10 h-10 min-w-[40px] min-h-[40px]",
      imageSize: 40,
      text: "text-xl font-bold tracking-tight",
      sub: "text-[11px]",
      gap: "gap-3",
    },
    lg: {
      box: "w-12 h-12 min-w-[48px] min-h-[48px]",
      imageSize: 48,
      text: "text-2xl font-bold tracking-tight",
      sub: "text-xs",
      gap: "gap-3.5",
    },
  }[size];

  const content = (
    <div
      className={cn(
        "inline-flex items-center text-decoration-none group cursor-pointer select-none",
        sizeClasses.gap,
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shrink-0 rounded-lg shadow-2xs relative bg-secondary",
          sizeClasses.box,
          monogramClassName
        )}
      >
        <Image
          src="/icon.png"
          alt={`${name} logo`}
          width={sizeClasses.imageSize}
          height={sizeClasses.imageSize}
          className="w-full h-full object-contain rounded-lg"
          priority
        />
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            "text-on-surface group-hover:text-primary transition-colors leading-tight font-bold tracking-tight",
            sizeClasses.text,
            textClassName
          )}
        >
          {name}
        </span>
        {subtitle && (
          <span
            className={cn("text-[#8e9192] uppercase tracking-wider font-mono", sizeClasses.sub)}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={`${name} Homepage`}
        className="text-decoration-none inline-flex items-center"
      >
        {content}
      </Link>
    );
  }

  return content;
}
