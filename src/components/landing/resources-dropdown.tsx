"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function ResourcesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openDropdown = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const closeDropdown = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250);
  };

  const toggleDropdown = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative inline-flex items-center text-left"
      onMouseEnter={openDropdown}
      onMouseLeave={closeDropdown}
    >
      <button
        type="button"
        onClick={toggleDropdown}
        className="inline-flex items-center gap-1 text-inherit text-xs font-normal hover:opacity-80 transition-opacity p-0 bg-transparent border-0 cursor-pointer"
        aria-expanded={isOpen}
      >
        <span>Resources</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 opacity-70 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full pt-1.5 w-max min-w-[275px] z-50 animate-in fade-in slide-in-from-top-1 duration-150"
          onMouseEnter={openDropdown}
          onMouseLeave={closeDropdown}
        >
          {/* Invisible hit-area bridge to prevent hover dropping */}
          <div className="absolute inset-x-0 -top-3 h-4" />

          <div className="relative rounded-xl bg-card text-on-surface border border-border-hairline shadow-popover p-1.5 space-y-0.5">
            <a
              href="/invoice-generator"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between gap-4 px-3 py-2 rounded-lg hover:bg-surface-container-low text-xs font-medium text-on-surface transition-colors whitespace-nowrap"
            >
              <span>Free invoice generator</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-tertiary-container text-on-tertiary-container border border-tertiary/20 whitespace-nowrap shrink-0">
                Free Tool
              </span>
            </a>

            <a
              href="/valuation-calculator"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between gap-4 px-3 py-2 rounded-lg hover:bg-surface-container-low text-xs font-medium text-on-surface transition-colors whitespace-nowrap"
            >
              <span>Business valuation calculator</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-tertiary-container text-on-tertiary-container border border-tertiary/20 whitespace-nowrap shrink-0">
                Free Tool
              </span>
            </a>

            <a
              href="/blog"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between gap-4 px-3 py-2 rounded-lg hover:bg-surface-container-low text-xs font-medium text-on-surface transition-colors whitespace-nowrap"
            >
              <span>Blog</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary-container text-on-primary-container border border-primary/20 whitespace-nowrap shrink-0">
                Illustrated
              </span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
