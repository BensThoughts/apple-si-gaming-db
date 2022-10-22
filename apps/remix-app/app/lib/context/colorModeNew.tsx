import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { useFetcher } from '@remix-run/react';

enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

const themes: Array<Theme> = Object.values(Theme);

function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && themes.includes(value as Theme);
}

type ThemeContextType = [Theme | null, Dispatch<SetStateAction<Theme | null>>];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const prefersDarkMQ = '(prefers-color-scheme: dark)';
const getPreferredTheme = () => (window.matchMedia(prefersDarkMQ).matches ? Theme.DARK : Theme.LIGHT);


function ThemeProvider({
  children,
  specifiedTheme,
}: {
  children: ReactNode;
  specifiedTheme?: Theme | null;
}) {
  const [theme, setTheme] = useState<Theme | null>(() => {
    if (specifiedTheme) {
      if (themes.includes(specifiedTheme)) {
        return specifiedTheme;
      } else {
        return null;
      }
    }
    if (typeof window !== 'object') {
      return null;
    }
    return getPreferredTheme();
  });

  const persistTheme = useFetcher();

  // TODO: remove this when persistTheme is memoized properly
  const persistThemeRef = useRef(persistTheme);
  useEffect(() => {
    persistThemeRef.current = persistTheme;
  }, [persistTheme]);

  const mountRun = useRef(false);

  useEffect(() => {
    if (!mountRun.current) {
      mountRun.current = true;
      return;
    }
    if (!theme) {
      return;
    }

    persistThemeRef.current.submit({ theme }, { action: 'action/set-theme', method: 'post' });
  }, [theme]);

  return <ThemeContext.Provider value={[theme, setTheme]}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// function NonFlashOfWrongThemeEls({ ssrTheme }: { ssrTheme: boolean }) {
//   return <>{ssrTheme ? null : <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} />}</>;
// }

export { Theme, ThemeProvider, useTheme, isTheme };
