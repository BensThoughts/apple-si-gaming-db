import prisma from '~/lib/database/db.server';
import type {
  PerformancePostForUserProfileDisplay,
} from '~/interfaces';


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
): Promise<PerformancePostForUserProfileDisplay[]> {
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
              frameRateAverage: true,
              frameRateStutters: true,
              gamepadMetadata: {
                select: {
                  description: true,
                },
              },
              gamepadRating: true,
              postText: true,
              ratingMedal: true,
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
      ratingMedal,
      frameRateAverage,
      frameRateStutters,
      gamepadMetadata,
      gamepadRating,
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
    },
  }) => ({
    performancePostId: id,
    createdAt,
    numLikes: usersWhoLiked,
    rating: {
      ratingMedal,
      frameRateAverage,
      frameRateStutters,
      gamepadMetadata,
      gamepadRating,
    },
    postText,
    postTags,
    steamApp: {
      steamAppId,
      name,
      headerImage,
    },
    userWhoCreated: {
      steamUserId64: steamUserId64.toString(),
      displayName,
      avatarMedium,
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
