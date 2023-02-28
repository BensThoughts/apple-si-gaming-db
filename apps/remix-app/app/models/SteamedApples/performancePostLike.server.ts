import prisma from '~/lib/database/db.server';

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
