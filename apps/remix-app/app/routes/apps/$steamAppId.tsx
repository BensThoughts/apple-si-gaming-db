import { useActionData, useLoaderData, useTransition } from '@remix-run/react';
import type { ActionArgs, LoaderArgs } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import ExternalLinks from '~/components/AppInfo/ExternalLinks';
import AppInfoRequirements from '~/components/AppInfo/Requirements';
import MainAppCard from '~/components/AppInfo/MainAppCard';
import LoadingComponent from '~/components/LoadingComponent';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { createPerformancePost } from '~/models/performancePost.server';
import { getSteamAppDetailsRequest } from '~/lib/data-utils/steamApi.server';
import { searchSteamAppByAppId, updateSteamApp, convertSteamApiDataToPrisma } from '~/models/steamApp.server';
import PerformancePostLayout from '~/components/AppInfo/PerformancePostLayout';
import AppInfoTags from '~/components/AppInfo/Tags';
import PerformancePostForm from '~/components/AppInfo/PerformancePostForm';
import { AppleIcon, LinuxIcon, WindowsIcon } from '~/components/Icons';
import Heading from '~/components/Heading';

export async function loader({ params, context }: LoaderArgs) {
  invariant(params.steamAppId, 'Expected params.steamAppId');
  const steamAppId = Number(params.steamAppId);
  invariant(typeof steamAppId === 'number', 'Expected steamAppId to be a valid number');
  invariant(!isNaN(steamAppId), 'Expected steamAppId to be a valid number');
  let steamApp = await searchSteamAppByAppId(steamAppId);
  if (steamApp && (!steamApp?.dataDownloadAttempted || steamApp?.name === 'UNKNOWN_APP')) {
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
  invariant(typeof steamAppId === 'number', 'Expected appid to be a valid number');
  invariant(!isNaN(steamAppId), 'Expected appid to be a valid number');
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
    macRequirementsMinimum,
    macRequirementsRecommended,
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
        <div>
          <h1 className="text-3xl md:text-4xl text-center text-secondary">
            {name}
          </h1>
        </div>
        <div className='flex flex-col gap-2'>
          <div className="flex items-center justify-center bg-primary-highlight p-[3px] md:p-[6px] rounded-lg">
            {headerImage && <img
              src={headerImage}
              alt={`Header for ${name}`}
              width={460}
              height={215}
              className='rounded-md'
              onError={(e) => {
                e.currentTarget.src = '/no-image-placeholder.svg';
              }}
            />}
          </div>

          <div className='flex flex-row justify-between text-sm px-2'>
            {releaseDate && (
              <span>
                Released:&nbsp;
                <i className='italic'>{releaseDate}</i>
              </span>
            )}
            <div className='flex gap-1'>
              <AppleIcon
                size={19}
                className={platformMac ? `text-icon-secondary-highlight` : `text-icon-primary-highlight`}
              />
              <WindowsIcon
                size={19}
                className={platformWindows ? `text-icon-secondary-highlight` : `text-icon-primary-highlight`}
              />
              <LinuxIcon
                size={19}
                className={platformLinux ? `text-icon-secondary-highlight` : `text-icon-primary-highlight`}
              />
            </div>
          </div>
        </div>

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
        {(macRequirementsMinimum || macRequirementsRecommended) &&
          <div className="w-full max-w-2xl">
            <AppInfoRequirements
              macRequirementsMinimum={macRequirementsMinimum}
              macRequirementsRecommended={macRequirementsRecommended}
            />
          </div>
        }
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
