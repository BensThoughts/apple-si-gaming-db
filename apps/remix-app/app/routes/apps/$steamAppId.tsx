import { useActionData, useLoaderData, useTransition } from '@remix-run/react';
import type { ActionArgs, LoaderArgs } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';

import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { createPerformancePost } from '~/models/performancePost.server';
import { getSteamAppDetailsRequest } from '~/lib/data-utils/steamApi.server';
import {
  searchSteamAppByAppId,
  updateSteamApp,
  convertSteamApiDataToPrisma,
} from '~/models/steamApp.server';

import AppInfoTags from '~/components/AppInfo/Tags';
import ExternalLinks from '~/components/AppInfo/ExternalLinks';
import Heading from '~/components/Heading';
import LoadingComponent from '~/components/LoadingComponent';
import MainAppCard from '~/components/AppInfo/MainAppCard';
import PerformancePostForm from '~/components/AppInfo/PerformancePostForm';
import PerformancePostLayout from '~/components/AppInfo/PerformancePostLayout';
import AppInfoTabs from '~/components/AppInfo/AppInfoTabs';
import AppInfoDisclosure from '~/components/AppInfo/AppInfoDisclosure';
import AppInfoHeader from '~/components/AppInfo/AppInfoHeader';

export async function loader({ params, context }: LoaderArgs) {
  invariant(params.steamAppId, 'Expected params.steamAppId');
  const steamAppId = Number(params.steamAppId);
  invariant(isFinite(steamAppId), 'Expected steamAppId to be a valid number');
  let steamApp = await searchSteamAppByAppId(steamAppId);
  if (steamApp && (!steamApp?.dataDownloadAttempted)) {
    const steamApiApp = await getSteamAppDetailsRequest(steamApp.steamAppId);
    if (steamApiApp.data) {
      const prismaSteamApp = convertSteamApiDataToPrisma(steamApiApp.data);
      await updateSteamApp(prismaSteamApp);
      steamApp = await searchSteamAppByAppId(steamAppId);
    }
  }
  const steamUser = extractAppLoadContext(context).steamUser;
  return json({
    steamApp,
    steamUser,
  });
}

export async function action({
  request,
  params,
  context,
}: ActionArgs) {
  invariant(params.steamAppId, 'Expected params.appid');
  const steamAppId = Number(params.steamAppId);
  invariant(isFinite(steamAppId), 'Expected appid to be a valid number');
  const { steamUser } = extractAppLoadContext(context);
  invariant(steamUser, 'You must be logged into a valid Steam account to post performance reviews');
  const steamUserId = steamUser.steamUserId;
  const formData = await request.formData();
  const postText = formData.get('postText');
  invariant(postText, 'No text found in performance post');

  try {
    await createPerformancePost({
      steamUserId,
      steamAppId,
      postText: postText.toString(),
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      throw new Error('(Error in createPerformancePost', { cause: err });
    }
    const values = Object.fromEntries(formData);
    return json({ err, values });
  }

  return redirect(`/apps/${steamAppId}`);
}

export default function AppsRoute() {
  const { steamApp, steamUser } = useLoaderData<typeof loader>();
  const actionData = useActionData();
  const transition = useTransition();

  if (transition.state === 'loading' || transition.state === 'submitting') {
    return (
      <LoadingComponent />
    );
  }

  if (!steamApp) {
    return (
      <div>
        No App Found
      </div>
    );
  }
  const {
    name,
    steamAppId,
    headerImage,
    // type,
    requiredAge,
    platformLinux,
    platformMac,
    platformWindows,
    // controllerSupport,
    releaseDate,
    shortDescription,
    pcRequirementsMinimum,
    linuxRequirementsMinimum,
    macRequirementsMinimum,
    genres,
    categories,
    performancePosts,
    usersWhoOwnApp, // This will either be 1 user (the current logged in one) or 0 users
  } = steamApp;
  let userOwnsApp = false;
  if (steamUser) {
    userOwnsApp = usersWhoOwnApp.map((user) => user.steamUserId).includes(steamUser.steamUserId);
  }
  return (
    <div className="bg-app-bg h-full">
      <div className="flex flex-col gap-4 justify-center items-center max-w-2xl">
        <AppInfoHeader
          name={name}
          headerImage={headerImage}
          releaseDate={releaseDate}
          platformMac={platformMac}
          platformLinux={platformLinux}
          platformWindows={platformWindows}
        />
        <div className="flex w-full h-full justify-center items-center gap-2">
          <ExternalLinks steamAppId={steamAppId} />
        </div>

        {((genres.length > 0) || (categories.length > 0)) &&
          <div className="w-full max-w-2xl">
            <AppInfoTags
              genres={genres}
              categories={categories}
            />
          </div>
        }
        {(macRequirementsMinimum || pcRequirementsMinimum || linuxRequirementsMinimum) && (
          <div className='w-full max-w-2xl'>
            <AppInfoDisclosure title='Requirements'>
              <AppInfoTabs
                macRequirementsMinimum={macRequirementsMinimum}
                pcRequirementsMinimum={pcRequirementsMinimum}
                linuxRequirementsMinimum={linuxRequirementsMinimum}
              />
            </AppInfoDisclosure>
          </div>
        )}
        {shortDescription &&
        <div>
          <MainAppCard
            requiredAge={requiredAge}
            shortDescription={shortDescription}
          />
        </div>
        }
        <Heading>Performance Posts</Heading>
        <div className='w-full'>
          <PerformancePostLayout performancePosts={performancePosts} />
        </div>
        <div className='w-full'>
          <PerformancePostForm
            steamUser={steamUser}
            userOwnsApp={userOwnsApp}
            actionData={actionData}
          />
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>Error in /search route</h1>
      <pre>{error.message}</pre>
    </div>
  );
}
