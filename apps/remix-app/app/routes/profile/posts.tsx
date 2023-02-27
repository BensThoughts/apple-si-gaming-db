import type { LoaderArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import UsersPostsLayout from '~/components/Profile/Posts/UsersPostsLayout';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { useLoaderData } from '@remix-run/react';
import { useUserLikedPostIds } from '~/lib/hooks/useMatchesData';
import type {
  PerformancePostBase,
  PerformancePostLikes,
  PerformancePostRating,
  PerformancePostSteamApp,
} from '~/interfaces';
import { findPerformancePostsBySteamUserId } from '~/models/SteamedApples/performancePost.server';

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

  const prismaPerformancePosts = await findPerformancePostsBySteamUserId(steamUser.steamUserId64);

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
      performancePostId: id,
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
  const likedPerformancePostIds = useUserLikedPostIds();
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
