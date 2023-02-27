import type { LoaderArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { findUserProfileLikedPosts } from '~/models/SteamedApples/userProfile.server';
import { useLoaderData } from '@remix-run/react';
import { useUserLikedPostIds } from '~/lib/hooks/useMatchesData';
import UserLikedPostsLayout from '~/components/Profile/LikedPosts/UserLikedPostsLayout';
import type {
  PerformancePostBase,
  PerformancePostLikes,
  PerformancePostRating,
  PerformancePostSteamApp,
} from '~/interfaces';
import { getProfileSession } from '~/lib/sessions/profile-session.server';

interface ProfilePostsRouteLoaderData {
  steamUserLikedPosts: (PerformancePostBase & {
    steamApp: PerformancePostSteamApp;
    rating: PerformancePostRating;
    likes: PerformancePostLikes;
  })[]
}

export async function loader({ request }: LoaderArgs) {
  // const { steamUser } = extractAppLoadContext(context);
  // // TODO: This should maybe return more info about the problem
  // if (!steamUser) {
  //   return redirect('/profile');
  // }
  const profileSession = await getProfileSession(request);
  const userProfileId = Number(profileSession.getUserProfileId());
  if (!userProfileId) {
    return redirect('/profile');
  }
  const prismaSteamUser = await findUserProfileLikedPosts(userProfileId);
  if (!prismaSteamUser) {
    return json<ProfilePostsRouteLoaderData>({
      steamUserLikedPosts: [],
    });
  }
  const prismaSteamUserLikedPosts = prismaSteamUser.likedPerformancePosts;
  const steamUserLikedPosts = prismaSteamUserLikedPosts.map(({
    performancePost: {
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
    performancePostId: id,
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
  const likedPerformancePostIds = useUserLikedPostIds();
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
