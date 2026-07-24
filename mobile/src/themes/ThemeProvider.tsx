import React, { createContext, useContext, useMemo, useState } from 'react';
import { DEFAULT_THEME_ID, getTheme } from './index';
import type { Theme, ThemeId } from './types';

type ActiveThemeContextValue = {
  theme: Theme;
  setTheme: (theme: ThemeId | Theme) => void;
};

const ActiveThemeContext = createContext<ActiveThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getTheme(DEFAULT_THEME_ID));

  const setTheme = (next: ThemeId | Theme) => {
    setThemeState(typeof next === 'string' ? getTheme(next) : next);
  };

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ActiveThemeContext.Provider value={value}>{children}</ActiveThemeContext.Provider>;
}

export function useActiveTheme() {
  const ctx = useContext(ActiveThemeContext);
  if (!ctx) throw new Error('useActiveTheme must be used within a ThemeProvider');
  return ctx;
}
