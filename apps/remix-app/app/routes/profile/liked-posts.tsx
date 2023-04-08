import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { findUserProfileLikedPosts } from '~/models/SteamedApples/performancePostLike.server';
import { useLoaderData } from '@remix-run/react';
import LikedPostsLayout from '~/components/Profile/LikedPosts/LikedPostsLayout';
import type {
  PerformancePost,
} from '~/types';
import { requireUserIds } from '~/lib/sessions/profile-session.server';

interface ProfilePostsRouteLoaderData {
  userProfileLikedPosts: PerformancePost[]
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
    <LikedPostsLayout likedPosts={userProfileLikedPosts} />
  );
}
