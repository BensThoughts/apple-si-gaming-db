import type {
  Prisma,
  SteamAppWithoutMetadata,
  SteamUser,
  SteamUserSystemSpecs,
  SteamUserWithoutMetadata,
} from '~/interfaces/database';

import type { PassportSteamUser } from '~/interfaces';

import prisma from '~/lib/database/db.server';

function extractSystemSpecs(
    systemData: string,
) {
  const manufacturerRe = /Manufacturer:\s*([^\r\n]+)/i;
  const modelRe = /Model:\s*([^\r\n]+)/i;
  const formFactorRe = /Form Factor:\s*([^\r\n]+)/i;
  const cpuVendorRe = /CPU Vendor:\s*([^\r\n]+)/i;
  const cpuBrandRe = /CPU Brand:\s*([^\r\n]+)/i;
  const cpuFamilyRe = /CPU Family:\s*([^\r\n]+)/i;
  const cpuModelRe = /CPU Model:\s*([^\r\n]+)/i;
  const cpuSteppingRe = /CPU Stepping:\s*([^\r\n]+)/i;
  const cpuTypeRe = /CPU Type:\s*([^\r\n]+)/i;
  const cpuSpeedRe = /Speed:\s*([^\r\n]+)/i;
  const operatingSystemVersionRe = /Operating System Version:[\r\n]+\s*([^\r\n]+)/i;

  const videoDriverRe = /Driver:\s*([^\r\n]+)/i;
  const videoDriverVersionRe = /Driver Version:\s*([^\r\n]+)/i;
  const videoPrimaryVRAMRe = /Primary VRAM:\s*([^\r\n]+)/i;
  const memoryRAMRe = /RAM:\s*([^\r\n]+)/i;


  const manufacturer = systemData.match(manufacturerRe);
  const model = systemData.match(modelRe);
  const formFactor = systemData.match(formFactorRe);
  const cpuVendor = systemData.match(cpuVendorRe);
  const cpuBrand = systemData.match(cpuBrandRe);
  const cpuFamily = systemData.match(cpuFamilyRe);
  const cpuModel = systemData.match(cpuModelRe);
  const cpuStepping = systemData.match(cpuSteppingRe);
  const cpuType = systemData.match(cpuTypeRe);
  const cpuSpeed = systemData.match(cpuSpeedRe);
  const osVersion = systemData.match(operatingSystemVersionRe);
  const videoDriver = systemData.match(videoDriverRe);
  const videoDriverVersion = systemData.match(videoDriverVersionRe);
  const videoPrimaryVRAM = systemData.match(videoPrimaryVRAMRe);
  const memoryRAM = systemData.match(memoryRAMRe);

  return {
    manufacturer: manufacturer ? manufacturer[1] : null,
    model: model ? model[1] : null,
    formFactor: formFactor ? formFactor[1] : null,
    cpuVendor: cpuVendor ? cpuVendor[1] : null,
    cpuBrand: cpuBrand ? cpuBrand[1] : null,
    cpuFamily: cpuFamily ? cpuFamily[1] : null,
    cpuModel: cpuModel ? cpuModel[1] : null,
    cpuStepping: cpuStepping ? cpuStepping[1] : null,
    cpuType: cpuType ? cpuType[1] : null,
    cpuSpeed: cpuSpeed ? cpuSpeed[1] : null,
    osVersion: osVersion ? osVersion[1] : null,
    videoDriver: videoDriver ? videoDriver[1] : null,
    videoDriverVersion: videoDriverVersion ? videoDriverVersion[1] : null,
    videoPrimaryVRAM: videoPrimaryVRAM ? videoPrimaryVRAM[1] : null,
    memoryRAM: memoryRAM ? memoryRAM[1] : null,
  };
}

export async function createSystemSpecs(
    steamUserId: SteamUser['steamUserId'],
    systemName: SteamUserSystemSpecs['systemName'],
    systemData: string,
) {
  const sysSpecs = extractSystemSpecs(systemData);
  return prisma.steamUserSystemSpecs.create({
    data: {
      steamUserId,
      systemName,
      ...sysSpecs,
    },
  });
}
function exclude<T, Key extends keyof T>(
    user: T,
    ...keys: Key[]
): Omit<T, Key> {
  for (const key of keys) {
    delete user[key];
  }
  return user;
}

export async function findSteamUserSystemNamesByUserId(
    steamUserId: SteamUser['steamUserId'],
) {
  const user = await prisma.steamUser.findUnique({
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
  if (!user) return null;
  const { systemSpecs } = user;
  return systemSpecs.map((system) => system.systemName);
}


export function convertPassportSteamUserToPrismaSteamUser(passportSteamUser: PassportSteamUser): SteamUserWithoutMetadata {
  return {
    steamUserId: passportSteamUser._json.steamid,
    displayName: passportSteamUser.displayName,
    communityVisibilityState: passportSteamUser._json.communityvisibilitystate,
    profileState: passportSteamUser._json.profilestate,
    personaName: passportSteamUser._json.personaname,
    commentPermission: passportSteamUser._json.commentpermission,
    profileUrl: passportSteamUser._json.profileurl,
    avatar: passportSteamUser._json.avatar,
    avatarMedium: passportSteamUser._json.avatarmedium,
    avatarFull: passportSteamUser._json.avatarfull,
    avatarHash: passportSteamUser._json.avatarhash,
    lastLogoff: passportSteamUser._json.lastlogoff,
    personaState: passportSteamUser._json.personastate,
    realName: passportSteamUser._json.realname,
    primaryClanId: passportSteamUser._json.primaryclanid,
    timeCreated: passportSteamUser._json.timecreated,
    personaStateFlags: passportSteamUser._json.personastateflags,
    locCountryCode: passportSteamUser._json.loccountrycode,
    locStateCode: passportSteamUser._json.locstatecode,
    locCityId: passportSteamUser._json.loccityid,
  };
}

export async function upsertPassportSteamUserToPrisma(
    passportSteamUser: PassportSteamUser,
    select: Prisma.SteamUserSelect,
) {
  const prismaSteamUser = convertPassportSteamUserToPrismaSteamUser(passportSteamUser);
  return upsertSteamUser(prismaSteamUser, select);
}

export async function updateUserOwnedApps(
    steamAppIds: SteamAppWithoutMetadata['steamAppId'][],
    steamUserId: SteamUserWithoutMetadata['steamUserId'],
) {
  return prisma.steamUser.update({
    where: {
      steamUserId,
    },
    data: {
      ownedApps: {
        connect: steamAppIds.map((steamAppId) => ({
          steamAppId,
        })),
      },
    },
  });
}

export async function doesSteamUserOwnApp(
    steamUserId: SteamUserWithoutMetadata['steamUserId'],
    steamAppId: SteamAppWithoutMetadata['steamAppId'],
) {
  const steamUser = await prisma.steamUser.findUnique({
    where: {
      steamUserId,
    },
    select: {
      ownedApps: {
        where: {
          steamAppId,
        },
        select: {
          steamAppId: true,
        },
      },
    },
  });
  if (!steamUser) {
    return false;
  }
  return steamUser.ownedApps.map((app) => app.steamAppId).includes(steamAppId);
}

export async function findUserOwnedApps(steamUserId: SteamUserWithoutMetadata['steamUserId']) {
  return prisma.steamUser.findUnique({
    where: {
      steamUserId,
    },
    include: {
      ownedApps: {
        where: {
          comingSoon: {
            equals: false,
          },
          type: {
            contains: 'game',
            mode: 'insensitive',
          },
        },
        select: {
          steamAppId: true,
          name: true,
          headerImage: true,
          platformMac: true,
          genres: true,
          // categories: true,
        },
      },
    },
  });
}

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
