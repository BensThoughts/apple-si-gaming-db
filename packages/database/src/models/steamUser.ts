import type { Prisma, PrismaSteamUser, PrismaSteamApp } from '../interfaces';
import { prisma } from '../client';

export async function findUserBySteamId(
    steamUserId: PrismaSteamUser['steamUserId'],
    select?: Prisma.SteamUserSelect,
) {
  return prisma.steamUser.findUnique({
    where: { steamUserId },
    select,
  });
}

export async function createSteamUser(
    steamUser: PrismaSteamUser,
    select?: Prisma.SteamUserSelect,
) {
  return prisma.steamUser.create({
    data: {
      ...steamUser,
    },
    select,
  });
}

export async function deleteUserBySteamId(
    steamUserId: PrismaSteamUser['steamUserId'],
    select?: Prisma.SteamUserSelect,
) {
  return prisma.steamUser.delete({
    where: { steamUserId },
    select,
  });
}

export async function updateUserOwnedApps(
    steamAppIds: PrismaSteamApp['steamAppId'][],
    steamUserId: PrismaSteamUser['steamUserId'],
    select?: Prisma.SteamUserSelect,
) {
  return prisma.steamUser.update({
    where: {
      steamUserId,
    },
    data: {
      ownedApps: {
        connectOrCreate: steamAppIds.map((steamAppId) => ({
          where: {
            steamAppId,
          },
          create: {
            steamAppId,
            name: 'UNKNOWN_APP',
          },
        })),
      },
    },
    select,
  });
}

export async function upsertSteamUser(
    steamUser: PrismaSteamUser,
    select?: Prisma.SteamUserSelect,
) {
  return prisma.steamUser.upsert({
    where: {
      steamUserId: steamUser.steamUserId,
    },
    create: {
      ...steamUser,
    },
    update: {
      ...steamUser,
    },
    select,
  });
}

