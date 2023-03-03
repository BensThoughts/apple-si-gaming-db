import type { LoaderArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import UsersPostsLayout from '~/components/Profile/Posts/UsersPostsLayout';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { useLoaderData } from '@remix-run/react';
import type {
  PerformancePostBase,
  PerformancePostLikes,
  PerformancePostRating,
  PerformancePostSteamApp,
  PerformancePostUserWhoCreated,
} from '~/interfaces';
import { findPerformancePostsBySteamUserId } from '~/models/SteamedApples/performancePost.server';

interface ProfilePostsRouteLoaderData {
  steamUsersPosts: (PerformancePostBase & {
    userWhoCreatedPost: PerformancePostUserWhoCreated;
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
  const steamUserId64 = steamUser.steamUserId64;

  const steamUsersPosts = await findPerformancePostsBySteamUserId(steamUserId64);

  return json<ProfilePostsRouteLoaderData>({
    steamUsersPosts,
  });
}

export default function ProfilePostsRoute() {
  const { steamUsersPosts } = useLoaderData<ProfilePostsRouteLoaderData>();
  return (
    <UsersPostsLayout
      steamUsersPosts={steamUsersPosts.map((performancePost) => ({
        ...performancePost,
        createdAt: new Date(performancePost.createdAt),
      }))}
    />
  );
}
