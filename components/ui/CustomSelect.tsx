"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectGroup {
  category: string;
  label: string;
  options: SelectOption[];
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  groups?: SelectGroup[];
  options?: SelectOption[];
  placeholder?: string;
  className?: string;
  dropdownWidthClassName?: string;
}

export function CustomSelect({
  value,
  onChange,
  groups,
  options,
  placeholder = "Seçiniz...",
  className = "",
  dropdownWidthClassName = "w-64 min-w-[240px]",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find currently selected label
  let selectedLabel = placeholder;
  if (groups) {
    for (const group of groups) {
      const found = group.options.find((opt) => opt.value === value);
      if (found) {
        selectedLabel = found.label;
        break;
      }
    }
  } else if (options) {
    const found = options.find((opt) => opt.value === value);
    if (found) {
      selectedLabel = found.label;
    }
  }

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 border-b border-hairline py-1 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent focus:border-accent focus:outline-none dark:border-white/10 dark:hover:border-accent dark:hover:text-accent-strong"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-accent dark:text-accent-strong" : "text-ink-muted"
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute left-0 top-full z-50 mt-1.5 max-h-72 overflow-y-auto rounded-xl border border-hairline bg-surface/95 p-1.5 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-[#181715]/95 dark:shadow-black/80 ${dropdownWidthClassName} [scrollbar-width:thin] [scrollbar-color:var(--color-hairline)_transparent]`}
          >
            {groups &&
              groups.map((group, groupIdx) => (
                <div key={group.category} className={groupIdx > 0 ? "mt-1.5 border-t border-hairline/50 pt-1.5 dark:border-white/5" : ""}>
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent dark:text-accent-strong">
                    {group.label}
                  </div>
                  <div className="mt-0.5 space-y-0.5">
                    {group.options.map((opt) => {
                      const isSelected = opt.value === value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            onChange(opt.value);
                            setIsOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-all duration-150 ${
                            isSelected
                              ? "bg-accent/15 text-accent font-semibold dark:bg-accent/20 dark:text-accent-strong"
                              : "text-ink hover:bg-black/5 hover:text-ink dark:text-[#edeae3] dark:hover:bg-white/10 dark:hover:text-white"
                          }`}
                        >
                          <span className="truncate">{opt.label}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-accent dark:text-accent-strong" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

            {options && (
              <div className="space-y-0.5">
                {options.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-all duration-150 ${
                        isSelected
                          ? "bg-accent/15 text-accent font-semibold dark:bg-accent/20 dark:text-accent-strong"
                          : "text-ink hover:bg-black/5 hover:text-ink dark:text-[#edeae3] dark:hover:bg-white/10 dark:hover:text-white"
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-accent dark:text-accent-strong" />}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
