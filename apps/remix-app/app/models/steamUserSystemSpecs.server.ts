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

export async function findSystemSpecSystemNames(
    steamUserId: SteamUserSystemSpecs['steamUserId'],
) {
  const sysSpecs = await prisma.steamUser.findUnique({
    where: {
      steamUserId,
    },
    select: {
      systemSpecs: {
        select: {
          systemName: true,
        },
      },
    },
  });
  if (!sysSpecs) {
    return null;
  }
  return sysSpecs.systemSpecs.map((sysSpec) => sysSpec.systemName);
}

export async function updateSteamUserSystemSpecSystemName(
    steamUserId: SteamUserSystemSpecs['steamUserId'],
    systemName: SteamUserSystemSpecs['systemName'],
    updatedSystemName: SteamUserSystemSpecs['systemName'],
) {
  return prisma.steamUserSystemSpecs.update({
    where: {
      systemName_steamUserId: {
        steamUserId,
        systemName,
      },
    },
    data: {
      systemName: updatedSystemName,
    },
  });
}
