"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  // This component is client-only, but this keeps things safe and explicit.
  if (typeof window === "undefined") return "light";

  const stored = localStorage.getItem("theme");
  return stored === "dark" ? "dark" : "light";
}

function StandingDogIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 14c2-2 4-3 7-3h4c2.5 0 4 1.5 5 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 11V8c0-1.5 1.2-2.5 2.7-2.5h1.8c1.5 0 2.7 1 2.7 2.5v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 14v5M10 14v5M15 14v5M19 14v5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="9.2" cy="8.6" r="0.6" fill="currentColor" />
      <path
        d="M6.5 7.5 5 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SleepingDogIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 15c2.5-2 5-3 8-3 3.5 0 5.5 1 6 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 15c0 2 1.5 4 5 4s5-2 5-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 10c.7-.7 1.4-.7 2.1 0M12.3 10c.7-.7 1.4-.7 2.1 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M15.5 8.5c1 0 2-.5 2.5-1.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16.8 5.6h2.6M16.8 4.1h1.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10"
    >
      {isDark ? (
        <SleepingDogIcon className="h-5 w-5" />
      ) : (
        <StandingDogIcon className="h-5 w-5" />
      )}
    </button>
  );
}
