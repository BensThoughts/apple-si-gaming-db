import type { LoaderArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import UsersPostsLayout from '~/components/Profile/Posts/UsersPostsLayout';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { findSteamUsersPerformancePosts } from '~/models/steamUser.server';
import { useLoaderData } from '@remix-run/react';
import { useSteamUserLikedPostIds } from '~/lib/hooks/useMatchesData';
import type {
  PerformancePostBase,
  PerformancePostLikes,
  PerformancePostRating,
  PerformancePostSteamApp,
} from '~/interfaces';

interface ProfilePostsRouteLoaderData {
  steamUsersPosts: (PerformancePostBase & {
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
  const prismaSteamUser = await findSteamUsersPerformancePosts(steamUser.steamUserId);
  if (!prismaSteamUser) {
    return json<ProfilePostsRouteLoaderData>({
      steamUsersPosts: [],
    });
  }
  const prismaPerformancePosts = prismaSteamUser.PerformancePosts;
  const steamUsersPosts =
    prismaPerformancePosts.map(({
      id,
      createdAt,
      postText,
      _count: {
        usersWhoLiked,
      },
      ratingMedal,
      frameRateAverage,
      frameRateStutters,
      steamApp: {
        steamAppId,
        name,
        headerImage,
      },
    }) => ({
      postId: id,
      createdAt,
      postText,
      likes: {
        numLikes: usersWhoLiked,
      },
      rating: {
        ratingMedal,
        frameRateAverage,
        frameRateStutters,
      },
      steamApp: {
        steamAppId,
        name,
        headerImage,
      },
    }));
  return json<ProfilePostsRouteLoaderData>({
    steamUsersPosts,
  });
}

export default function ProfilePostsRoute() {
  const { steamUsersPosts } = useLoaderData<ProfilePostsRouteLoaderData>();
  const likedPerformancePostIds = useSteamUserLikedPostIds();
  return (
    <UsersPostsLayout
      userSession={{ likedPerformancePostIds }}
      steamUsersPosts={steamUsersPosts.map((performancePost) => ({
        ...performancePost,
        createdAt: new Date(performancePost.createdAt),
      }))}
    />
  );
}
