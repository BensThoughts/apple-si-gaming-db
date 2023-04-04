import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { findUserProfileLikedPosts } from '~/models/SteamedApples/performancePostLike.server';
import { useLoaderData } from '@remix-run/react';
import UserLikedPostsLayout from '~/components/Profile/LikedPosts/UserLikedPostsLayout';
import type {
  PerformancePostForUserProfileDisplay,
} from '~/interfaces';
import { requireUserIds } from '~/lib/sessions/profile-session.server';

interface ProfilePostsRouteLoaderData {
  userProfileLikedPosts: PerformancePostForUserProfileDisplay[]
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
    <UserLikedPostsLayout likedPosts={userProfileLikedPosts} />
  );
}
