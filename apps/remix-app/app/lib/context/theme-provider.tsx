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
  ssrCookieTheme,
}: {
  children: ReactNode;
  ssrCookieTheme: Theme | null;
}) {
  const [theme, setTheme] = useState<Theme | null>(() => {
    if (ssrCookieTheme) {
      if (themes.includes(ssrCookieTheme)) {
        return ssrCookieTheme;
      } else {
        return null;
      }
    }
    return null;
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
      if (!ssrCookieTheme) {
        setTheme(getPreferredTheme());
      }
      return;
    }
    if (!theme) {
      return;
    }

    persistThemeRef.current.submit({ theme }, { action: 'actions/set-theme', method: 'post' });
  }, [theme, ssrCookieTheme]);

  // useEffect(() => {
  //   const mediaQuery = window.matchMedia(prefersDarkMQ);
  //   const handleChange = () => {
  //     setTheme(mediaQuery.matches ? Theme.DARK : Theme.LIGHT);
  //   };
  //   mediaQuery.addEventListener('change', handleChange);
  //   return () => mediaQuery.removeEventListener('change', handleChange);
  // }, []);

  return <ThemeContext.Provider value={[theme, setTheme]}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// const clientThemeCode = `
// ;(() => {
//   const theme = 'light';
//   const cl = document.documentElement.classList;
//   const themeAlreadyApplied = cl.contains('light') || cl.contains('dark');
//   if (themeAlreadyApplied) {
//     // this script shouldn't exist if the theme is already applied!
//     console.warn(
//       "Hi there, could you let me know you're seeing this message? Thanks!",
//     );
//   } else {
//     cl.add(theme);
//   }
// })();
// `;

// const clientThemeCode = `
// ;(() => {
//   // ...

//   const meta = document.querySelector('meta[name=color-scheme]');
//   if (meta) {
//     if (theme === 'dark') {
//       meta.content = 'dark light';
//     } else if (theme === 'light') {
//       meta.content = 'light dark';
//     }
//   } else {
//     console.warn(
//       "Hey, could you let Matt know you're seeing this message? Thanks!",
//     );
//   }
// })();
// `;

const setInitialTheme = `
  (function() {
    function getInitialColorMode() {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const hasMediaQueryPreference = typeof mql.matches === 'boolean';
      if (hasMediaQueryPreference) {
        return mql.matches ? 'dark' : 'light';
      }
      return 'light';
    }
    const colorMode = getInitialColorMode();
    document.body.dataset.theme = colorMode;
  })()`;

// const clientThemeCode = `
// ;(() => {
//   const theme = window.matchMedia(${JSON.stringify(prefersDarkMQ)}).matches
//     ? 'dark'
//     : 'light';
//   const cl = document.documentElement.classList;
//   const themeAlreadyApplied = cl.contains('light') || cl.contains('dark');
//   if (themeAlreadyApplied) {
//     // this script shouldn't exist if the theme is already applied!
//     console.warn(
//       "Hi there, could you let me know you're seeing this message? Thanks!",
//     );
//   } else {
//     cl.add(theme);
//   }
// })();
// `;

function NonFlashOfWrongThemeEls({ ssrTheme }: { ssrTheme: boolean }) {
  // const [theme] = useTheme();
  return (
    <>
      {
        ssrTheme ? null : (
          // <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} />
          <>
            {/* <meta name="color-scheme" content={theme === 'light' ? 'light dark' : 'dark light'} /> */}
            <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
          </>
          )
      }
    </>
  );
}

export { Theme, ThemeProvider, useTheme, isTheme, NonFlashOfWrongThemeEls };
