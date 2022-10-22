import { isTheme } from '../context/theme-provider';
import type { Theme } from '../context/theme-provider';
import { createCookieSessionStorage } from '@remix-run/node';

const sessionSecret = process.env.ASGD_THEME_SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('ASGD_THEME_SESSION_SECRET must be set');
}

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: '__theme_session',
    secrets: [sessionSecret],
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    // secure: true,
    path: '/',
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
