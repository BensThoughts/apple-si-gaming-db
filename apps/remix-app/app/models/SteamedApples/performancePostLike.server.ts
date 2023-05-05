import prisma from '~/lib/database/db.server';
import type {
  PerformancePost,
} from '~/types';
import { isTypeFrameRateTierRank, isTypeGamepadTierRank } from '~/lib/form-validators/posts';


// Uses upsert to make it idempotent
export async function likePerformancePost(
    performancePostId: number,
    userProfileId: number,
) {
  return prisma.performancePostLike.upsert({
    where: {
      userProfileId_performancePostId: {
        userProfileId,
        performancePostId,
      },
    },
    create: { performancePostId, userProfileId },
    update: { performancePostId, userProfileId },
  });
}

// Uses deleteMany to make it idempotent
export async function unlikePerformancePost(
    performancePostId: number,
    userProfileId: number,
) {
  return prisma.performancePostLike.deleteMany({
    where: {
      performancePostId,
      userProfileId,
    },
  });
}

export async function findUserProfileLikedPosts(
    userProfileId: number,
): Promise<PerformancePost[]> {
  const userProfile = await prisma.userProfile.findUnique({
    where: {
      id: userProfileId,
    },
    select: {
      likedPerformancePosts: {
        orderBy: {
          updatedAt: 'desc',
        },
        select: {
          performancePost: {
            select: {
              id: true,
              createdAt: true,
              _count: {
                select: {
                  usersWhoLiked: true,
                },
              },
              frameRateTierRank: true,
              frameRateStutters: true,
              gamepadMetadata: {
                select: {
                  id: true,
                  description: true,
                },
              },
              gamepadTierRank: true,
              postText: true,
              ratingTierRank: true,
              postTags: true,
              steamApp: {
                select: {
                  steamAppId: true,
                  name: true,
                  headerImage: true,
                },
              },
              steamUserProfile: {
                select: {
                  steamUserId64: true,
                  displayName: true,
                  avatarMedium: true,
                },
              },
              systemManufacturer: true,
              systemModel: true,
              systemCpuBrand: true,
              systemOsVersion: true,
              systemVideoDriver: true,
              systemVideoDriverVersion: true,
              systemVideoPrimaryVRAM: true,
              systemMemoryRAM: true,
            },
          },
        },
      },
    },
  });
  if (!userProfile) {
    return [];
  }
  const {
    likedPerformancePosts,
  } = userProfile;
  return likedPerformancePosts.map(({
    performancePost: {
      id,
      createdAt,
      _count: {
        usersWhoLiked,
      },
      ratingTierRank,
      frameRateTierRank,
      frameRateStutters,
      gamepadMetadata,
      gamepadTierRank,
      postText,
      postTags,
      steamApp: {
        steamAppId,
        name,
        headerImage,
      },
      steamUserProfile: {
        steamUserId64,
        avatarMedium,
        displayName,
      },
      systemManufacturer,
      systemModel,
      systemOsVersion,
      systemCpuBrand,
      systemVideoDriver,
      systemVideoDriverVersion,
      systemVideoPrimaryVRAM,
      systemMemoryRAM,
    },
  }) => ({
    performancePostId: id,
    createdAt: createdAt.toDateString(),
    numLikes: usersWhoLiked,
    rating: {
      ratingTierRank,
      frameRateTierRank:
        isTypeFrameRateTierRank(frameRateTierRank) ? frameRateTierRank : undefined,
      frameRateStutters,
      gamepadMetadata: gamepadMetadata ? gamepadMetadata : undefined,
      gamepadTierRank:
        isTypeGamepadTierRank(gamepadTierRank) ? gamepadTierRank : undefined,
    },
    postText,
    postTags,
    steamApp: {
      steamAppId,
      name,
      headerImage: headerImage ? headerImage : undefined,
    },
    userWhoCreated: {
      steamUserId64: steamUserId64.toString(),
      displayName: displayName ? displayName : undefined,
      avatarMedium: avatarMedium ? avatarMedium : undefined,
    },
    systemSpec: {
      manufacturer: systemManufacturer,
      model: systemModel,
      osVersion: systemOsVersion,
      cpuBrand: systemCpuBrand,
      videoDriver: systemVideoDriver,
      videoDriverVersion: systemVideoDriverVersion,
      videoPrimaryVRAM: systemVideoPrimaryVRAM,
      memoryRAM: systemMemoryRAM,
    },
  }));
}

// export async function likePost(
//     performancePostId: number,
//     userProfileId: number,
// ) {
//   return prisma.performancePost.update({
//     where: {
//       id: performancePostId,
//     },
//     data: {
//       usersWhoLiked: {
//         upsert: {
//           where: {
//             userProfileId_performancePostId: {
//               userProfileId,
//               performancePostId,
//             },
//           },
//           update: {
//             userProfileId,
//           },
//           create: {
//             userProfileId,
//           },
//         },
//       },
//     },
//   });
// }

// export async function unlikePost(
//     performancePostId: number,
//     userProfileId: number,
// ) {
//   return prisma.performancePost.update({
//     where: {
//       id: performancePostId,
//     },
//     data: {
//       usersWhoLiked: {
//         deleteMany: {
//           AND: {
//             userProfileId,
//             performancePostId,
//           },
//         },
//       },
//     },
//   });
// }
