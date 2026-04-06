"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && (resolvedTheme === "light" || theme === "light");

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className="border-mantl-gold-border bg-mantl-card text-mantl-muted hover:border-mantl-gold-border-hover hover:shadow-mantl fixed top-7 right-7 z-50 flex cursor-pointer items-center gap-2.5 rounded-full border px-[18px] py-2 transition-all duration-500 ease-in-out select-none"
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
    >
      <span className="font-mono text-[10px] font-light uppercase tracking-[2px]">
        Theme
      </span>
      <span
        className="bg-mantl-gold-border relative h-[18px] w-9 rounded-[9px] transition-colors duration-500"
        aria-hidden
      >
        <span
          className={`bg-mantl-gold absolute top-[3px] left-[3px] h-3 w-3 rounded-full transition-transform duration-300 ease-out ${
            isLight ? "translate-x-[18px]" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}
