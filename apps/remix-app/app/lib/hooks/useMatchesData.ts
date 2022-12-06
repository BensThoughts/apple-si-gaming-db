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

function useRootPrismaLoaderData() {
  const rootLoaderData = useRootLoaderData();
  if (!rootLoaderData) {
    return undefined;
  }
  const {
    steamUserData: {
      prismaData,
    },
  } = rootLoaderData;
  if (!prismaData) {
    return undefined;
  }
  return prismaData;
}

export function useRootSteamUserContextData() {
  const rootLoaderData = useRootLoaderData();
  if (!rootLoaderData) {
    return undefined;
  }
  const {
    steamUserData: {
      contextData,
    },
  } = rootLoaderData;
  return contextData;
}

export function useSteamUserOwnedApps() {
  const prismaUserData = useRootPrismaLoaderData();
  if (!prismaUserData) {
    return undefined;
  }
  return prismaUserData.ownedApps;
}

export function useSteamUserSystemSpecs() {
  const prismaUserData = useRootPrismaLoaderData();
  if (!prismaUserData) {
    return undefined;
  }
  return prismaUserData.systemSpecs;
}

function useRootCookieLoaderData() {
  const rootLoaderData = useRootLoaderData();
  if (!rootLoaderData) {
    return undefined;
  }
  const {
    cookieData,
  } = rootLoaderData;
  return cookieData;
}

export function useBannerData() {
  const rootCookieData = useRootCookieLoaderData();
  if (!rootCookieData) {
    return undefined;
  }
  return rootCookieData.banners;
}

export function useSteamUserLikedPostIds() {
  const prismaUserData = useRootPrismaLoaderData();
  if (!prismaUserData) {
    return undefined;
  }
  return prismaUserData.likedPerformancePostIds;
}
