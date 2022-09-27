import type { SteamUserSystemSpecs } from '~/interfaces/database';
import type { SystemSpec } from '~/interfaces';
import prisma from '~/lib/database/db.server';

export async function createSystemSpecs(
    steamUserId: SteamUserSystemSpecs['steamUserId'],
    systemName: SteamUserSystemSpecs['systemName'],
    systemSpec: SystemSpec,
) {
  return prisma.steamUserSystemSpecs.create({
    data: {
      steamUserId,
      systemName,
      ...systemSpec,
    },
  });
}

export async function deleteSystemSpecs(
    steamUserId: SteamUserSystemSpecs['steamUserId'],
    systemName: SteamUserSystemSpecs['systemName'],
) {
  return prisma.steamUserSystemSpecs.delete({
    where: {
      systemName_steamUserId: {
        steamUserId,
        systemName,
      },
    },
  });
}
