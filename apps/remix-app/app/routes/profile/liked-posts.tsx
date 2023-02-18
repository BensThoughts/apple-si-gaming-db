import type { LoaderArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { findSteamUserLikedPosts } from '~/models/steamUser.server';
import { useLoaderData } from '@remix-run/react';
import { useSteamUserLikedPostIds } from '~/lib/hooks/useMatchesData';
import UserLikedPostsLayout from '~/components/Profile/LikedPosts/UserLikedPostsLayout';
import type {
  PerformancePostBase,
  PerformancePostLikes,
  PerformancePostRating,
  PerformancePostSteamApp,
} from '~/interfaces';

interface ProfilePostsRouteLoaderData {
  steamUserLikedPosts: (PerformancePostBase & {
    steamApp: PerformancePostSteamApp;
    rating: PerformancePostRating;
    likes: PerformancePostLikes;
  })[]
}

export async function loader({ context }: LoaderArgs) {
  const { steamUser } = extractAppLoadContext(context);
  // TODO: This should maybe return more info about the problem
  if (!steamUser) {
    return redirect('/profile');
  }
  const prismaSteamUser = await findSteamUserLikedPosts(steamUser.steamUserId);
  if (!prismaSteamUser) {
    return json<ProfilePostsRouteLoaderData>({
      steamUserLikedPosts: [],
    });
  }
  const prismaSteamUserLikedPosts = prismaSteamUser.likedPerformancePosts;
  const steamUserLikedPosts = prismaSteamUserLikedPosts.map(({
    steamPerformancePost: {
      id,
      createdAt,
      _count: {
        usersWhoLiked,
      },
      ratingMedal,
      frameRateAverage,
      frameRateStutters,
      postText,
      steamApp: {
        steamAppId,
        name,
        headerImage,
      },
    },
  }) => ({
    postId: id,
    createdAt,
    likes: {
      numLikes: usersWhoLiked,
    },
    rating: {
      ratingMedal,
      frameRateAverage,
      frameRateStutters,
    },
    postText,
    steamApp: {
      steamAppId,
      name,
      headerImage,
    },
  }));
  return json<ProfilePostsRouteLoaderData>({
    steamUserLikedPosts,
  });
}

export default function ProfilePostsRoute() {
  const { steamUserLikedPosts } = useLoaderData<ProfilePostsRouteLoaderData>();
  const likedPerformancePostIds = useSteamUserLikedPostIds();
  return (
    <UserLikedPostsLayout
      userSession={{ likedPerformancePostIds }}
      likedPosts={steamUserLikedPosts.map((performancePost) => ({
        ...performancePost,
        createdAt: new Date(performancePost.createdAt),
      }))}
    />
  );
}
