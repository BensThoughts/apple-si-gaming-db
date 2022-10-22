import { isTheme } from '../context/theme-provider';
import type { Theme } from '../context/theme-provider';
import { createCookieSessionStorage } from '@remix-run/node';

// const sessionSecret = process.env.SESSION_SECRET;
const sessionSecret = 'SETNEWSECRET';

if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: '__theme_session',
    // secure: true,
    secrets: [sessionSecret],
    sameSite: 'lax',
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
