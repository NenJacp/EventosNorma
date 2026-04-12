"use client";

import { useEffect, useState, useCallback } from "react";

export type ThemeMode = "light" | "dark";

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("theme-mode");
  return (stored as ThemeMode) || "dark";
}

export function setStoredTheme(mode: ThemeMode) {
  if (typeof window === "undefined") return;
  localStorage.setItem("theme-mode", mode);
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    setMode(getStoredTheme());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    setStoredTheme(mode);
  }, [mode]);

  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { mode, toggleTheme };
}

export const themeColors = {
  light: {
    bg: "bg-white",
    bgSecondary: "bg-gray-50",
    text: "text-gray-800",
    textSecondary: "text-gray-600",
    textMuted: "text-gray-500",
    border: "border-gray-300",
    inputBg: "bg-white",
    inputFocus: "focus:border-blue-500 focus:ring-blue-100",
    buttonPrimary: "bg-slate-900 hover:bg-slate-800",
    buttonText: "text-white",
    buttonSecondary: "bg-gray-100 hover:bg-gray-200",
    buttonSecondaryText: "text-gray-800",
    accent: "blue",
  },
  dark: {
    bg: "bg-slate-900",
    bgSecondary: "bg-slate-800",
    text: "text-white",
    textSecondary: "text-gray-300",
    textMuted: "text-gray-400",
    border: "border-slate-700",
    inputBg: "bg-slate-800",
    inputFocus: "focus:border-blue-400 focus:ring-blue-900",
    buttonPrimary: "bg-white hover:bg-gray-100",
    buttonText: "text-slate-900",
    buttonSecondary: "bg-slate-700 hover:bg-slate-600",
    buttonSecondaryText: "text-white",
    accent: "blue",
  },
};

export function getThemeClasses(mode: ThemeMode) {
  return themeColors[mode];
}