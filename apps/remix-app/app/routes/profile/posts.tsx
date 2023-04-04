import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import UsersPostsLayout from '~/components/Profile/Posts/UsersPostsLayout';
import { useLoaderData } from '@remix-run/react';
import type {
  PerformancePostForUserProfileDisplay,
} from '~/interfaces';
import { findPerformancePostsBySteamUserId } from '~/models/SteamedApples/performancePost.server';
import { requireUserIds } from '~/lib/sessions/profile-session.server';
interface ProfilePostsRouteLoaderData {
  steamUsersPosts: PerformancePostForUserProfileDisplay[];
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
    <UsersPostsLayout steamUsersPosts={steamUsersPosts} />
  );
}
