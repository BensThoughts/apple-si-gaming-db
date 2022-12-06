import type { LoaderArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { findSteamUserLikedPosts } from '~/models/steamUser.server';
import type { SteamPerformancePost, SteamApp } from '~/interfaces/database';
import { useLoaderData } from '@remix-run/react';
import { useSteamUserLikedPostIds } from '~/lib/hooks/useMatchesData';
import UserLikedPostsLayout from '~/components/Profile/LikedPosts/UserLikedPostsLayout';

interface ProfilePostsRouteLoaderData {
  steamUserLikedPosts: {
    _count: {
      usersWhoLiked: number;
    };
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
  const steamUserLikedPosts = await findSteamUserLikedPosts(steamUser.steamUserId);
  if (!steamUserLikedPosts) {
    return json<ProfilePostsRouteLoaderData>({
      steamUserLikedPosts: [],
    });
  }
  return json<ProfilePostsRouteLoaderData>({
    steamUserLikedPosts: steamUserLikedPosts.likedPerformancePosts.map((likePosts) => likePosts.steamPerformancePost),
  });
}

export default function ProfilePostsRoute() {
  const { steamUserLikedPosts } = useLoaderData<ProfilePostsRouteLoaderData>();
  const likedPerformancePostIds = useSteamUserLikedPostIds();
  return (
    <UserLikedPostsLayout
      isUserLoggedIn={true}
      likedPerformancePostIds={likedPerformancePostIds ? likedPerformancePostIds : []}
      steamUsersPosts={steamUserLikedPosts.map((performancePost) => ({
        ...performancePost,
        numLikes: performancePost._count.usersWhoLiked,
        createdAt: new Date(performancePost.createdAt),
      }))}
    />
  );
}
