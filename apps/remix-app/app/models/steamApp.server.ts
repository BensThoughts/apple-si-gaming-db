import {
  updateSteamApp,
  updateSteamAppDownloadAttempted,
  convertSteamApiDataToPrisma,
} from '@apple-si-gaming-db/database';

import type {
  PrismaSteamApp,
} from '~/interfaces';

import prisma from '~/lib/database/db.server';

export {
  updateSteamApp,
  updateSteamAppDownloadAttempted,
  convertSteamApiDataToPrisma,
};

export async function searchAllAppsByAppIds(
    steamAppIds: PrismaSteamApp['steamAppId'][],
) {
  return prisma.steamApp.findMany({
    where: {
      steamAppId: { in: steamAppIds },
    },
    select: {
      steamAppId: true,
      // name: true,
      // headerImage: true,
    },
  });
}

export async function searchSteamAppByAppId(
    steamAppId: PrismaSteamApp['steamAppId'],
) {
  return prisma.steamApp.findUnique({
    where: {
      steamAppId,
    },
    select: {
      steamAppId: true,
      name: true,
      dataDownloadAttempted: true,
      dataDownloaded: true,
      headerImage: true,
      type: true,
      requiredAge: true,
      controllerSupport: true,
      shortDescription: true,
      releaseDate: true,
      macRequirementsMinimum: true,
      macRequirementsRecommended: true,
      genres: true,
      categories: true,
      performancePosts: true,
    },
  });
}

export async function searchReleasedMacSteamAppsByName(
    name: PrismaSteamApp['name'],
) {
  return prisma.steamApp.findMany({
    where: {
      name: {
        contains: name,
        mode: 'insensitive',
      },
      platformMac: {
        equals: true,
      },
      comingSoon: {
        equals: false,
      },
    },
    orderBy: {
      name: 'asc',
    },
    select: {
      steamAppId: true,
      name: true,
      headerImage: true,
    },
  });
}
