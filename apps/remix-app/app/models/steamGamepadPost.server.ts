import type { PostTag, Prisma, SteamGamepadPost, SteamUserSystemSpecs } from '~/interfaces/database';
import prisma from '~/lib/database/db.server';
import { findUniqueSystemSpecForPost } from './steamUserSystemSpecs.server';

export async function findGamepadPostsBySteamAppId(
    steamAppId: SteamGamepadPost['steamAppId'],
) {
  return prisma.steamGamepadPost.findMany({
    where: {
      steamAppId,
    },
    select: {
      id: true,
      createdAt: true,
      displayName: true,
      avatarMedium: true,
      postText: true,
      ratingMedal: true,
      postTags: {
        select: {
          postTagId: true,
          description: true,
        },
      },
      gamepad: {
        select: {
          description: true,
        },
      },
    },
  });
}

export async function createGamepadPost({
  steamAppId,
  steamUserId,
  avatarMedium,
  displayName,
  postText,
  gamepadId,
  ratingMedal,
  postTagIds,
  systemName,
}: {
  steamAppId: SteamGamepadPost['steamAppId'];
  steamUserId: SteamGamepadPost['steamUserId'];
  avatarMedium?: SteamGamepadPost['avatarMedium'];
  displayName?: SteamGamepadPost['displayName'];
  postText: SteamGamepadPost['postText'];
  gamepadId: SteamGamepadPost['gamepadId'];
  ratingMedal: SteamGamepadPost['ratingMedal'];
  postTagIds: PostTag['postTagId'][];
  systemName: SteamUserSystemSpecs['systemName'];
}) {
  const systemSpec = await findUniqueSystemSpecForPost(steamUserId, systemName);
  const gamepadPostData: Prisma.SteamGamepadPostCreateInput = {
    steamApp: {
      connect: {
        steamAppId,
      },
    },
    steamUser: {
      connect: {
        steamUserId,
      },
    },
    steamUserId,
    avatarMedium,
    displayName,
    postText,
    gamepad: {
      connect: {
        gamepadId,
      },
    },
    ratingMedal,
    postTags: {
      connect: postTagIds.map((postTagId) => ({
        postTagId,
      })),
    },
  };
  if (!systemSpec) return prisma.steamGamepadPost.create({ data: { ...gamepadPostData } });
  return prisma.steamGamepadPost.create({
    data: {
      ...gamepadPostData,
      systemManufacturer: systemSpec.manufacturer,
      systemModel: systemSpec.model,
      systemCpuBrand: systemSpec.cpuBrand,
      systemOsVersion: systemSpec.osVersion,
      systemVideoDriver: systemSpec.videoDriver,
      systemVideoDriverVersion: systemSpec.videoDriverVersion,
      systemVideoPrimaryVRAM: systemSpec.videoPrimaryVRAM,
      systemMemoryRAM: systemSpec.memoryRAM,
    },
  });
}
