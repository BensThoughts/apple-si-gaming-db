import { useMatches } from '@remix-run/react';
import { useMemo } from 'react';
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

function useRootUserProfileLoaderData() {
  const rootLoaderData = useRootLoaderData();
  if (!rootLoaderData) {
    return undefined;
  }
  const {
    userProfile,
  } = rootLoaderData;
  if (!userProfile) {
    return undefined;
  }
  return userProfile;
}

export function useSteamUserProfile() {
  const userProfile = useRootUserProfileLoaderData();
  if (!userProfile) {
    return undefined;
  }
  const {
    steamUserId64,
    displayName,
    avatarFull,
    avatarMedium,
  } = userProfile.steamUserProfile;
  return { steamUserId64, displayName, avatarFull, avatarMedium };
}

export function useSteamUserOwnedSteamApps() {
  const userProfile = useRootUserProfileLoaderData();
  if (!userProfile) {
    return [];
  }
  const {
    steamUserProfile,
  } = userProfile;
  return steamUserProfile.ownedSteamApps;
}

export function useUserSystemSpecs() {
  const userProfile = useRootUserProfileLoaderData();
  if (!userProfile) {
    return [];
  }
  return userProfile.systemSpecs;
}

export function useBannerData() {
  const rootLoaderData = useRootLoaderData();
  if (!rootLoaderData) {
    return undefined;
  }
  return rootLoaderData.session.banners;
}

export function useUserLikedPostIds() {
  const userProfile = useRootUserProfileLoaderData();
  if (!userProfile) {
    return [];
  }
  return userProfile.likedPerformancePostIds;
}
