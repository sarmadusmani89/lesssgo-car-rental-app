'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';

interface ThemeContextType {
  theme: string;
  refreshTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default function ThemeProvider({ 
  children,
  initialTheme 
}: { 
  children: React.ReactNode;
  initialTheme?: string;
}) {
  const [theme, setTheme] = useState(initialTheme || 'theme-corporate-blue');

  // Use SWR for automatic revalidation and caching
  const { data: settings, mutate } = useSWR('/settings', (url) => 
    api.get(url).then(res => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 300000, // Background refresh every 5 mins
    }
  );

  useEffect(() => {
    if (settings?.theme) {
      setTheme(settings.theme);
    }
  }, [settings]);

  useEffect(() => {
    // Apply theme to body
    const body = document.body;
    
    // Remove old theme classes
    const themeClasses = ['theme-corporate-blue', 'theme-premium-green', 'theme-premium-orange'];
    themeClasses.forEach(cls => body.classList.remove(cls));
    
    // Add new theme class
    if (theme) {
      body.classList.add(theme);
    }
  }, [theme]);

  const refreshTheme = () => {
    mutate();
  };

  return (
    <ThemeContext.Provider value={{ theme, refreshTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
