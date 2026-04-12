"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className={cn(
        "fixed right-4 bottom-4 z-50 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border",
        "border-mantl-gold-border bg-card/85 text-mantl-muted backdrop-blur-sm transition-all duration-300",
        "hover:border-mantl-gold-border-hover hover:text-foreground hover:shadow-mantl md:right-6 md:bottom-6"
      )}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
    >
      {isLight ? <Moon className="size-4" aria-hidden /> : <Sun className="size-4" aria-hidden />}
    </button>
  );
}
