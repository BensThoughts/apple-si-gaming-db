import { isTheme } from '../context/theme-provider';
import type { Theme } from '../context/theme-provider';
import { createCookieSessionStorage } from '@remix-run/node';
import invariant from '@apple-si-gaming-db/invariant';

const { REMIX_APP_THEME_SESSION_SECRET } = process.env;
invariant(typeof REMIX_APP_THEME_SESSION_SECRET === 'string', 'REMIX_APP_THEME_SESSION_SECRET env var not set');

type ThemeSessionData = {
  theme: Theme;
};

const themeStorage = createCookieSessionStorage<ThemeSessionData>({
  cookie: {
    name: '__theme_session',
    secrets: [REMIX_APP_THEME_SESSION_SECRET],
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    maxAge: 1000 * 60 * 60 * 24 * 400, // 400 days (max chrome cap)
    // path: '/',
    // httpOnly: true,
  },
});

async function getThemeSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get('Cookie'));
  return {
    getTheme: () => {
      const themeValue = session.get('theme');
      return isTheme(themeValue) ? themeValue : null;
    },
    setTheme: (theme: Theme) => session.set('theme', theme),
    commit: () => themeStorage.commitSession(session),
  };
}

export { getThemeSession };
