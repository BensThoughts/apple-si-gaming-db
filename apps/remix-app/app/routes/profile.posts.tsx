import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import ProfilePostsLayout from '~/components/Profile/Posts/ProfilePostsLayout';
import { useLoaderData } from '@remix-run/react';
import type {
  PerformancePost,
} from '~/types/remix-app';
import { findPerformancePostsBySteamUserId } from '~/models/SteamedApples/performancePost.server';
import { requireUserIds } from '~/lib/sessions/profile-session.server';
interface ProfilePostsRouteLoaderData {
  steamUsersPosts: PerformancePost[];
}

export async function loader({ request }: LoaderArgs) {
  const { steamUserId64 } = await requireUserIds(request, '/profile');
  const steamUsersPosts = await findPerformancePostsBySteamUserId(steamUserId64);
  return json<ProfilePostsRouteLoaderData>({
    steamUsersPosts,
  });
}

export default function ProfilePostsRoute() {
  const { steamUsersPosts } = useLoaderData<ProfilePostsRouteLoaderData>();
  return (
    <ProfilePostsLayout steamUsersPosts={steamUsersPosts} />
  );
}
