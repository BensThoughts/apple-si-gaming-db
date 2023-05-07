import type { PrismaUserSystemSpec } from '~/types/database';
import type { SteamSystemSpec } from '~/types/remix-app';
import prisma from '~/lib/database/db.server';
import type { UserSystemSpec } from '@apple-si-gaming-db/database';

// No other system can have systemName because of unique
// constraint of systemName_userProfileId. This check should be done prior to
// calling this function in the action so that an appropriate error response
// can be given back to the front end.
export async function createSystemSpec(
    userProfileId: PrismaUserSystemSpec['userProfileId'],
    systemName: PrismaUserSystemSpec['systemName'],
    systemSpec: SteamSystemSpec,
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
  return prisma.userSystemSpec.create({
    data: {
      userProfileId,
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

export async function deleteSystemSpec(
    systemSpecId: UserSystemSpec['id'],
) {
  return prisma.userSystemSpec.delete({
    where: { id: systemSpecId },
  });
}

export async function findSystemSpecSystemIds(
    userProfileId: PrismaUserSystemSpec['userProfileId'],
) {
  const sysSpecs = await prisma.userSystemSpec.findMany({
    where: {
      userProfileId,
    },
    select: {
      id: true,
    },
  });
  // if (!sysSpecs) {
  //   return null;
  // }
  return sysSpecs.map((sysSpec) => sysSpec.id);
}

export async function findSystemSpecSystemNames(
    userProfileId: PrismaUserSystemSpec['userProfileId'],
) {
  const sysSpecs = await prisma.userSystemSpec.findMany({
    where: {
      userProfileId,
    },
    select: {
      systemName: true,
    },
  });
  return sysSpecs.map((sysSpec) => sysSpec.systemName);
}

export async function doesUserOwnSystemSpec(
    userProfileId: PrismaUserSystemSpec['userProfileId'],
    systemSpecId: PrismaUserSystemSpec['id'],
) {
  const userSystemSpecCount = await prisma.userSystemSpec.count({
    where: {
      id: systemSpecId,
      userProfileId,
    },
  });
  if (userSystemSpecCount > 0) {
    return true;
  }
  return false;
}

export async function updateSystemSpecSystemName(
    systemSpecId: PrismaUserSystemSpec['id'],
    updatedSystemName: PrismaUserSystemSpec['systemName'],
) {
  // No other system can have updatedSystemName because of unique
  // constraint of systemName_userProfileId. This check should be done prior to
  // calling this function in the action so that an appropriate error response
  // can be given back to the front end.
  return prisma.userSystemSpec.update({
    where: {
      id: systemSpecId,
    },
    data: {
      systemName: updatedSystemName,
    },
  });
}

export async function findSystemSpecForPostBySystemSpecId(
    systemSpecId: PrismaUserSystemSpec['id'],
) {
  return prisma.userSystemSpec.findUnique({
    where: {
      id: systemSpecId,
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
