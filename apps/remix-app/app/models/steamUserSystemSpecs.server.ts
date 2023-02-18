import type { PrismaSteamUserSystemSpecs } from '~/interfaces/database';
import type { SystemSpec } from '~/interfaces';
import prisma from '~/lib/database/db.server';

export async function createSystemSpecs(
    steamUserId: PrismaSteamUserSystemSpecs['steamUserId'],
    systemName: PrismaSteamUserSystemSpecs['systemName'],
    systemSpec: SystemSpec,
) {
  // TODO: We know computerInformation, processorInformation, etc.
  // TODO: will not be null by this point because of validation includes
  // TODO: create-system.server.ts, maybe SystemSpec type needs to be
  // TODO: refactored
  const {
    manufacturer,
    model,
    formFactor,
  } = systemSpec.computerInformation ? systemSpec.computerInformation : {
    manufacturer: null,
    model: null,
    formFactor: null,
  };
  const {
    cpuVendor,
    cpuBrand,
    cpuFamily,
    cpuModel,
    cpuStepping,
    cpuType,
    cpuSpeed,
  } = systemSpec.processorInformation ? systemSpec.processorInformation : {
    cpuVendor: null,
    cpuBrand: null,
    cpuFamily: null,
    cpuModel: null,
    cpuStepping: null,
    cpuType: null,
    cpuSpeed: null,
  };
  const osVersion = systemSpec.os.osVersion;
  const {
    videoDriver,
    videoDriverVersion,
    videoPrimaryVRAM,
  } = systemSpec.videoCard ? systemSpec.videoCard : {
    videoDriver: null,
    videoDriverVersion: null,
    videoPrimaryVRAM: null,
  };
  const memoryRAM = systemSpec.memory.memoryRAM;
  return prisma.steamUserSystemSpecs.create({
    data: {
      steamUserId,
      systemName,
      manufacturer,
      model,
      formFactor,
      cpuVendor,
      cpuBrand,
      cpuFamily,
      cpuModel,
      cpuStepping,
      cpuType,
      cpuSpeed,
      osVersion,
      videoDriver,
      videoDriverVersion,
      videoPrimaryVRAM,
      memoryRAM,
    },
  });
}

export async function deleteSystemSpecs(
    steamUserId: PrismaSteamUserSystemSpecs['steamUserId'],
    systemName: PrismaSteamUserSystemSpecs['systemName'],
) {
  return prisma.steamUserSystemSpecs.deleteMany({
    where: {
      systemName,
      steamUserId,
      // systemName_steamUserId: {
      //   steamUserId,
      //   systemName,
      // },
    },
  });
}

export async function findSystemSpecSystemNames(
    steamUserId: PrismaSteamUserSystemSpecs['steamUserId'],
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
    steamUserId: PrismaSteamUserSystemSpecs['steamUserId'],
    systemName: PrismaSteamUserSystemSpecs['systemName'],
    updatedSystemName: PrismaSteamUserSystemSpecs['systemName'],
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

export async function findUniqueSystemSpecForPost(
    steamUserId: PrismaSteamUserSystemSpecs['steamUserId'],
    systemName: PrismaSteamUserSystemSpecs['systemName'],
) {
  return prisma.steamUserSystemSpecs.findUnique({
    where: {
      systemName_steamUserId: {
        steamUserId,
        systemName,
      },
    },
    select: {
      manufacturer: true,
      model: true,
      osVersion: true,
      cpuBrand: true,
      videoDriver: true,
      videoDriverVersion: true,
      videoPrimaryVRAM: true,
      memoryRAM: true,
    },
  });
}
