import {
  // createCookie,
  createCookieSessionStorage,
} from '@remix-run/node';

// TODO: Change secret to use ENV var
const profileSession = createCookieSessionStorage({
  cookie: {
    name: '__profile_session',
    secrets: ['ThisShouldChAng3'],
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  },
});

const getProfileSession = profileSession.getSession;
const commitProfileSession = profileSession.commitSession;
const destroyProfileSession = profileSession.destroySession;
export {
  getProfileSession,
  commitProfileSession,
  destroyProfileSession,
};
