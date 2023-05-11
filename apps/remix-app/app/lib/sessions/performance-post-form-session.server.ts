import { createCookieSessionStorage } from '@remix-run/node';
import invariant from '@apple-si-gaming-db/invariant';

export type PerformancePostFormSessionData = {
  wasSubmittedSuccessfully: boolean;
};

const ONE_YEAR = 1000 * 60 * 60 * 24 * 365;

const { REMIX_APP_PERFORMANCE_POST_FORM_SESSION_SECRET } = process.env;
invariant(typeof REMIX_APP_PERFORMANCE_POST_FORM_SESSION_SECRET === 'string', 'REMIX_APP_PERFORMANCE_POST_FORM_SESSION_SECRET env var not set');

export const { commitSession, getSession } = createCookieSessionStorage<PerformancePostFormSessionData>({
  cookie: {
    name: '__performance_post_form',
    path: '/',
    // httpOnly: true,
    sameSite: 'lax',
    expires: new Date(Date.now() + ONE_YEAR),
    secrets: [REMIX_APP_PERFORMANCE_POST_FORM_SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production' ? true : false,
  },
});

export async function getPerformancePostFormSession(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));

  return {
    getWasSubmittedSuccessfully: () => session.get('wasSubmittedSuccessfully'),
    setWasSubmittedSuccessfully: (
        wasSubmittedSuccessfully: boolean,
    ) => session.flash('wasSubmittedSuccessfully', wasSubmittedSuccessfully),
    commit: () => commitSession(session),
  };
}
