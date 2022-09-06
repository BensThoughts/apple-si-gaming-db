import { Form, useActionData, useLoaderData, useTransition } from '@remix-run/react';
import type { ActionArgs, LoaderArgs } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import ExternalLinks from '~/components/AppInfo/ExternalLinks';
import AppInfoGenres from '~/components/AppInfo/Genres';
import AppInfoCategories from '~/components/AppInfo/Categories';
import AppInfoRequirements from '~/components/AppInfo/Requirements';
import MainAppCard from '~/components/Cards/MainAppCard';
import LoadingComponent from '~/components/LoadingComponent';
import RoundedButton from '~/components/RoundedButton';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { createPerformancePost } from '~/models/performancePost.server';
import { getSteamAppDetailsRequest } from '~/lib/data-utils/steamApi.server';
import { searchSteamAppByAppId, updateSteamApp, convertSteamApiDataToPrisma } from '~/models/steamApp.server';

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
  invariant(params.appid, 'Expected params.appid');
  const appid = Number(params.appid);
  invariant(typeof appid === 'number', 'Expected appid to be a valid number');
  invariant(!isNaN(appid), 'Expected appid to be a valid number');
  const { steamUser } = extractAppLoadContext(context);
  invariant(steamUser, 'You must be logged into a valid Steam account to post performance reviews');
  const steamUserId = steamUser.steamUserId;
  const formData = await request.formData();
  const postText = formData.get('postText');
  invariant(postText, 'No text found in performance post');

  try {
    await createPerformancePost({
      steamUserId,
      steamAppId: appid,
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

  return redirect(`/apps/${appid}`);
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
    type,
    requiredAge,
    controllerSupport,
    releaseDate,
    shortDescription,
    macRequirementsMinimum,
    macRequirementsRecommended,
    genres,
    categories,
    performancePosts,
  } = steamApp;
  return (
    <div className="bg-app-bg h-full">
      <div className="flex flex-col gap-4 justify-center items-center">
        <div>
          <h1 className="text-4xl">
            {name}
          </h1>
        </div>
        {/* <div className="w-[584px] h-[272px]"> */}
        <div className="max-w-2xl w-[585px] h-[273px]">
          {headerImage && <img
            src={headerImage}
            alt={`Header for ${name}`}
            width={584}
            height={273}
          />}
        </div>
        <div className="flex justify-center items-center gap-2 m-2">
          <ExternalLinks steamAppId={steamAppId} />
        </div>
        {genres &&
          <div className="w-full max-w-2xl">
            <AppInfoGenres genres={genres} />
          </div>
        }
        {categories &&
          <div className="w-full max-w-2xl">
            <AppInfoCategories categories={categories} />
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
        <div>
          <MainAppCard
            type={type}
            requiredAge={requiredAge}
            controllerSupport={controllerSupport}
            shortDescription={shortDescription}
            releaseDate={releaseDate}
          />
        </div>
        {performancePosts.length > 0 && performancePosts.map((perfPost) => (
          <div key={perfPost.id}>
            {perfPost.postText}
          </div>
        ))}
        {steamUser &&
            <Form
              method="post"
              name="performancePost"
              className="flex flex-col items-center gap-3 w-full max-w-lg"
            >
              <label>
                Description:
                <textarea
                  name="postText"
                  className="bg-primary rounded p-2 w-full"
                  defaultValue={actionData?.values.postText}
                />
              </label>
              <RoundedButton type="submit" className="max-w-xs">Submit</RoundedButton>
            </Form>
        }
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
