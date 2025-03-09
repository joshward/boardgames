"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";

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
        className="bg-sage-5 hover:bg-sage-6 text-sage-12 rounded-xl p-3 transition duration-300 ease-in-out"
        aria-label={`Toggle to ${resolvedTheme} mode`}
      >
        {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  );
}
