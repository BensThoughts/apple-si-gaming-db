import {
  createCookieSessionStorage,
  redirect,
} from '@remix-run/node';
import type { UserSessionServerSide } from '~/interfaces';

const sessionSecret = process.env.ASGD_PROFILE_SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('ASGD_PROFILE_SESSION_SECRET must be set');
}

type ProfileSessionData = {
  userProfileId: number;
  steamUserId64: string; // BigInt in db
  displayName: string | null | undefined;
  avatarFull: string | null | undefined;
};

// type SessionFlashData = {
//   error: string;
// };

// TODO: Change secret to use ENV var
const userProfileSession = createCookieSessionStorage<ProfileSessionData>({
  cookie: {
    name: '__user_profile_session',
    secrets: [sessionSecret],
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
});

export async function getProfileSession(request: Request) {
  const session = await userProfileSession.getSession(request.headers.get('Cookie'));

  return {
    login: async (
        userProfileId: number,
        steamUserId64: string,
    ) => {
      session.set('userProfileId', userProfileId);
      session.set('steamUserId64', steamUserId64);
      // return userProfileSession.commitSession(session);
    },
    // logout: async () => {
    //   session.unset('userProfileId');
    //   session.unset('steamUserId64');
    //   return userProfileSession.destroySession(session);
    // },
    getUserProfileId: () => {
      const userProfileId = session.get('userProfileId');
      if (!userProfileId) {
        return undefined;
      }
      // TODO: Casting to Number because userProfileId used to be a string
      // TODO: any currently logged in users will get an error otherwise
      // TODO: this can go away in a couple months from 03/04/2023
      if (!isFinite(Number(userProfileId))) {
        return undefined;
      }
      return Number(userProfileId);
    },
    getSteamUserId64: () => session.get('steamUserId64'),
    getUserSession: (): UserSessionServerSide => {
      const steamUserId64 = session.get('steamUserId64');
      return {
        steamUserProfile: steamUserId64 ? {
          steamUserId64: steamUserId64,
          displayName: session.get('displayName'),
          avatarFull: session.get('avatarFull'),
        } : undefined,
      };
    },
    commit: () => userProfileSession.commitSession(session),
    destroy: () => userProfileSession.destroySession(session),
  };
}

export async function logout(request: Request) {
  const profileSession = await getProfileSession(request);
  const headers = new Headers();
  headers.append('Set-Cookie', await profileSession.destroy());
  return redirect('/api/auth/steam/logout', { headers, status: 302 });
}

// export async function getUserSession(request: Request): Promise<UserSessionServerSide | undefined> {
//   const { userProfileId, steamUserId64 } = await requireUserIds(request);
//   const
// }

export async function getUserIds(request: Request) {
  const profileSession = await getProfileSession(request);
  const userProfileId = profileSession.getUserProfileId();
  const steamUserId64 = profileSession.getSteamUserId64();
  return { userProfileId, steamUserId64 };
}

export async function requireUserIds(
    request: Request,
    redirectTo: string = new URL(request.url).pathname,
) {
  const { userProfileId, steamUserId64 } = await getUserIds(request);
  if (!userProfileId) throw redirect(redirectTo);
  if (!steamUserId64) throw redirect(redirectTo);

  return { userProfileId, steamUserId64 };
}
