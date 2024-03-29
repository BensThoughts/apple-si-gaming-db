import { useMatches } from '@remix-run/react';
import { useMemo } from 'react';
import type { SystemSpec, UserSessionClientSide } from '~/types/remix-app';
import type { SerializedRootLoaderData } from '~/root';

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @return {JSON|undefined} The router data or undefined if not found
 */
function useMatchesData(
    id: string,
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
      () => matchingRoutes.find((route) => route.id === id),
      [matchingRoutes, id],
  );
  return route?.data;
}

// function isUser(user: any): user is User {
//   return user && typeof user === "object" && typeof user.email === "string";
// }

function useRootLoaderData() {
  const rootLoaderData = useMatchesData('root');
  if (!rootLoaderData) {
    return undefined;
  }
  return rootLoaderData as SerializedRootLoaderData;
}

export function useUserSession(): UserSessionClientSide {
  const rootLoaderData = useRootLoaderData();
  if (!rootLoaderData) return { };

  const { userSession } = rootLoaderData;
  if (!userSession) return { };

  const { userProfile, steamUserProfile } = userSession;
  // if (!userProfile) return { steamUserProfile };

  // TODO: Case for useMemo?
  const likedPerformancePostIds = new Map<number, number>();
  userProfile.likedPerformancePostIds.forEach((performancePostId) => {
    likedPerformancePostIds.set(performancePostId, performancePostId);
  });

  return {
    userSession: {
      userProfile: {
        ...userProfile,
        likedPerformancePostIds,
      },
      steamUserProfile,
    },
  };
}

export function useUserProfileSystemSpecs(): SystemSpec[] {
  const { userSession } = useUserSession();
  return userSession ? userSession.userProfile.systemSpecs : [];
}

export function useLikeButtonData(performancePostId: number) {
  const { userSession } = useUserSession();
  if (!userSession) {
    return {
      isUserProfileLoggedIn: false,
      didUserProfileLikePerformancePost: false,
    };
  }
  const { userProfile } = userSession;
  const didUserProfileLikePerformancePost =
    userProfile.likedPerformancePostIds.has(performancePostId);
  return {
    isUserProfileLoggedIn: true,
    didUserProfileLikePerformancePost,
  };
}
