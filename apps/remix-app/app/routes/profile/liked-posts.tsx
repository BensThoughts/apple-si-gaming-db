import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { findUserProfileLikedPosts } from '~/models/SteamedApples/userProfile.server';
import { useLoaderData } from '@remix-run/react';
import UserLikedPostsLayout from '~/components/Profile/LikedPosts/UserLikedPostsLayout';
import type {
  PerformancePostBase,
  PerformancePostLikes,
  PerformancePostRating,
  PerformancePostSteamApp,
  PerformancePostUserWhoCreated,
} from '~/interfaces';
import { requireUserIds } from '~/lib/sessions/profile-session.server';

interface ProfilePostsRouteLoaderData {
  userProfileLikedPosts: (PerformancePostBase & {
    userWhoCreatedPost: PerformancePostUserWhoCreated;
    steamApp: PerformancePostSteamApp;
    rating: PerformancePostRating;
    likes: PerformancePostLikes;
  })[]
}

export async function loader({ request }: LoaderArgs) {
  const { userProfileId } = await requireUserIds(request, '/profile');
  const userProfileLikedPosts = await findUserProfileLikedPosts(userProfileId);
  return json<ProfilePostsRouteLoaderData>({
    userProfileLikedPosts,
  });
}

export default function ProfilePostsRoute() {
  const { userProfileLikedPosts } = useLoaderData<ProfilePostsRouteLoaderData>();
  return (
    <UserLikedPostsLayout
      likedPosts={userProfileLikedPosts.map((performancePost) => ({
        ...performancePost,
        createdAt: new Date(performancePost.createdAt),
      }))}
    />
  );
}
