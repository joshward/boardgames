"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { twMerge } from "tailwind-merge";
import {
  DefaultTransitionStyles,
  FocusResetStyles,
  ShowFocusOnKeyboardStyles,
} from "@/styles/common";

export function HeaderActions() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <button
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className={twMerge(
          DefaultTransitionStyles,
          FocusResetStyles,
          ShowFocusOnKeyboardStyles,
          "bg-sage-5 hover:bg-sage-6 text-sage-12 cursor-pointer rounded-xl p-3",
        )}
        aria-label={`Toggle to ${resolvedTheme} mode`}
      >
        {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  );
}
