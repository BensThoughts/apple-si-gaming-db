import { useMatches } from '@remix-run/react';
import { useMemo } from 'react';
import type { UserProfileSystemSpec, UserSession } from '~/interfaces/remix-app/UserSession';
import type { SerializedRootLoaderData } from '~/root';

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @return {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
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

export function useUserSession(): UserSession {
  const rootLoaderData = useRootLoaderData();
  if (!rootLoaderData) return { };

  const { userSession } = rootLoaderData;
  if (!userSession) return { };

  const { userProfile, steamUserProfile } = userSession;
  if (!userProfile) return { steamUserProfile };

  // TODO: Case for useMemo?
  const likedPerformancePostIds = new Map<number, number>();
  userProfile.likedPerformancePostIds.forEach((performancePostId) => {
    likedPerformancePostIds.set(performancePostId, performancePostId);
  });

  return {
    userProfile: {
      ...userProfile,
      likedPerformancePostIds,
    },
    steamUserProfile,
  };
}

export function useUserProfileSystemSpecs(): UserProfileSystemSpec[] {
  const { userProfile } = useUserSession();
  return userProfile ? userProfile.systemSpecs : [];
}

export function useLikeButtonData(performancePostId: number) {
  const { userProfile } = useUserSession();
  if (!userProfile) {
    return {
      isUserProfileLoggedIn: false,
      didUserProfileLikePerformancePost: false,
    };
  }
  const didUserProfileLikePerformancePost = userProfile.likedPerformancePostIds.has(performancePostId);
  return {
    isUserProfileLoggedIn: true,
    didUserProfileLikePerformancePost,
  };
}
