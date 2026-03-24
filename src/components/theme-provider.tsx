"use client";

import * as React from "react";
import { useEffect } from "react";

type Theme = "dark" | "light";

interface ThemeProviderContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeProviderContext | undefined>(
  undefined,
);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("dark");

  useEffect(() => {
    // Ao carregar, recupera o tema do localStorage ou preferência do sistema
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme =
      savedTheme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    setThemeState(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook customizado para substituir o 'useTheme' do next-themes
export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
