import type { LoaderArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import UsersPostsLayout from '~/components/Profile/Posts/UsersPostsLayout';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { findSteamUsersPerformancePosts } from '~/models/steamUser.server';
import type { SteamPerformancePost, SteamApp } from '~/interfaces/database';
import { useLoaderData } from '@remix-run/react';
import { useSteamUserLikedPostIds } from '~/lib/hooks/useMatchesData';

interface ProfilePostsRouteLoaderData {
  steamUsersPosts: {
    _count: {
      usersWhoLiked: number;
    },
    id: SteamPerformancePost['id'];
    steamAppId: SteamPerformancePost['steamAppId'];
    createdAt: SteamPerformancePost['createdAt'];
    ratingMedal: SteamPerformancePost['ratingMedal'];
    frameRateAverage: SteamPerformancePost['frameRateAverage'];
    frameRateStutters: SteamPerformancePost['frameRateStutters'];
    postText: SteamPerformancePost['postText'];
    steamApp: {
      name: SteamApp['name'];
      headerImage: SteamApp['headerImage'];
    }
  }[]
}

export async function loader({ context }: LoaderArgs) {
  const { steamUser } = extractAppLoadContext(context);
  // TODO: This should maybe return more info about the problem
  if (!steamUser) {
    return redirect('/profile');
  }
  const steamUsersPosts = await findSteamUsersPerformancePosts(steamUser.steamUserId);
  if (!steamUsersPosts) {
    return json<ProfilePostsRouteLoaderData>({
      steamUsersPosts: [],
    });
  }
  return json<ProfilePostsRouteLoaderData>({
    steamUsersPosts: steamUsersPosts.PerformancePosts,
  });
}

export default function ProfilePostsRoute() {
  const { steamUsersPosts } = useLoaderData<ProfilePostsRouteLoaderData>();
  const likedPerformancePostIds = useSteamUserLikedPostIds();
  return (
    <UsersPostsLayout
      isUserLoggedIn={true}
      likedPerformancePostIds={likedPerformancePostIds ? likedPerformancePostIds : []}
      steamUsersPosts={steamUsersPosts.map((performancePost) => ({
        ...performancePost,
        numLikes: performancePost._count.usersWhoLiked,
        createdAt: new Date(performancePost.createdAt),
      }))}
    />
  );
}
