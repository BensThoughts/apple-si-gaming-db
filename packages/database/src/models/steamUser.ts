import type { Prisma, SteamUserWithoutMetadata } from '../interfaces';
import { prisma } from '../client';

export async function findUserBySteamId(
    steamUserId: SteamUserWithoutMetadata['steamUserId'],
    select?: Prisma.SteamUserSelect,
) {
  return prisma.steamUser.findUnique({
    where: { steamUserId },
    select,
  });
}

export async function createSteamUser(
    steamUser: SteamUserWithoutMetadata,
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
    steamUserId: SteamUserWithoutMetadata['steamUserId'],
    select?: Prisma.SteamUserSelect,
) {
  return prisma.steamUser.delete({
    where: { steamUserId },
    select,
  });
}

export async function upsertSteamUser(
    steamUser: SteamUserWithoutMetadata,
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

