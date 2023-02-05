import type { LoaderArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import type { SiteAchievement } from '~/interfaces/database';
import AchievementsLayout from '~/components/Profile/Achievements/AchievementsLayout';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { findSiteAchievementsForSteamUser } from '~/models/siteAchievements.server';
import { useLoaderData } from '@remix-run/react';

type ProfileAchievementsLoaderData = {
  siteAchievements: {
    achievementId: SiteAchievement['achievementId'];
    title: SiteAchievement['title'];
    description: SiteAchievement['description'];
    imageUrl: SiteAchievement['imageUrl'];
    svgCode: SiteAchievement['svgCode'];
  }[]
}

export async function loader({ context }: LoaderArgs) {
  const { steamUser } = extractAppLoadContext(context);
  if (!steamUser) {
    return redirect('/profile');
  }
  const userData = await findSiteAchievementsForSteamUser(steamUser.steamUserId);
  if (!userData) {
    return json<ProfileAchievementsLoaderData>({
      siteAchievements: [],
    });
  }
  const { siteAchievements } = userData;
  return json<ProfileAchievementsLoaderData>({
    siteAchievements,
  });
}

export default function ProfileAchievementsRoute() {
  const { siteAchievements } = useLoaderData<ProfileAchievementsLoaderData>();
  return (
    <AchievementsLayout siteAchievements={siteAchievements} />
  );
}
