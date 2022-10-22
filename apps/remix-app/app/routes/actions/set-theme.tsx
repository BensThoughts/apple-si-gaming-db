import { json } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';

import { getThemeSession } from '~/lib/sessions/theme-session.server';
import { isTheme } from '~/lib/context/theme-provider';


export const action: ActionFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);
  const requestText = await request.text();
  const searchParams = new URLSearchParams(requestText);
  const theme = searchParams.get('theme');


  if (!isTheme(theme)) {
    return json({
      success: false,
      message: 'Theme is not a valid theme',
    });
  }

  themeSession.setTheme(theme);
  return json({ success: true }, { headers: { 'Set-Cookie': await themeSession.commit() } });
};
