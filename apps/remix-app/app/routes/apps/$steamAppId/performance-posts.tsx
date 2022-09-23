import type { LoaderArgs, ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import PerformancePostForm from '~/components/AppInfo/PerformancePosts/PerformancePostForm';
import PerformancePostLayout from '~/components/AppInfo/PerformancePosts/PerformancePostLayout';
// import { convertRatingMedalStringToRatingMedal } from '~/models/performancePost.server';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { createPerformancePost, findPerformancePostsByAppId } from '~/models/performancePost.server';
import { doesSteamUserOwnApp } from '~/models/steamUser.server';

export async function loader({ params, context }: LoaderArgs) {
  invariant(params.steamAppId, 'Expected params.steamAppId');
  const steamAppId = Number(params.steamAppId);
  invariant(isFinite(steamAppId), 'Expected steamAppId to be a valid number');
  const steamUser = extractAppLoadContext(context).steamUser;
  const performancePosts = await findPerformancePostsByAppId(steamAppId);

  let steamUserOwnsApp = false;
  let steamUserIsLoggedIn = false;
  if (steamUser) {
    steamUserIsLoggedIn = true;
    steamUserOwnsApp = await doesSteamUserOwnApp(steamUser.steamUserId, steamAppId);
  }
  return json({
    steamAppId,
    performancePosts,
    steamUserIsLoggedIn,
    steamUserOwnsApp,
  });
}

function validatePostRatingMedal(ratingMedal: string) {
  if (ratingMedal.toLowerCase() === 'none') {
    return `Rating cannot be None`;
  }
}

function validatePostText(postText: string) {
  if (postText.length < 3) {
    return `The performance posts text is too short (3 character minimum)`;
  }
  if (postText.length > 500) {
    return `The performance posts text is too long (500 character maximum)`;
  }
}

export type CreatePostActionData = {
  formError?: string;
  fieldErrors?: {
    postText?: string | undefined;
    ratingMedal?: string | undefined;
  };
  fields?: {
    postText: string;
    ratingMedal: string;
  };
};

const badRequest = (data: CreatePostActionData) => json(data, { status: 400 });

export async function action({
  request,
  params,
  context,
}: ActionArgs) {
  // TODO: Switch invariant to throw new Response to use catch.
  invariant(params.steamAppId, 'Expected params.appid');
  const steamAppId = Number(params.steamAppId);
  invariant(isFinite(steamAppId), 'Expected appid to be a valid number');
  const { steamUser } = extractAppLoadContext(context);
  invariant(steamUser, 'You must be logged into a valid Steam account to post performance reviews');
  const steamUserId = steamUser.steamUserId;
  const formData = await request.formData();
  const postText = formData.get('performancePostText');
  const ratingMedal = formData.get('performancePostRatingMedal');

  // TODO: Not sure if postText/ratingMedal should be string or FormDataEntryValue
  if (
    typeof postText !== 'string' ||
    typeof ratingMedal !== 'string'
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fieldErrors = {
    postText: validatePostText(postText),
    ratingMedal: validatePostRatingMedal(ratingMedal),
  };
  const fields = { postText, ratingMedal };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  try {
    await createPerformancePost({
      steamUserId,
      steamAppId,
      postText: postText,
      // ratingMedal: convertRatingMedalStringToRatingMedal(ratingMedal),
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      throw new Error('(Error in createPerformancePost', { cause: err });
    }
  }

  return redirect(`/apps/${steamAppId}/performance-posts`);
}

export default function PostsRoute() {
  const { performancePosts, steamUserOwnsApp, steamUserIsLoggedIn, steamAppId } = useLoaderData<typeof loader>();
  const actionData = useActionData<CreatePostActionData>();
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl text-primary-highlight">Performance Posts</h2>
      <div className="w-full">
        <PerformancePostLayout performancePosts={performancePosts} />
      </div>
      <div className="w-full">
        <PerformancePostForm
          steamAppId={steamAppId}
          steamUserIsLoggedIn={steamUserIsLoggedIn}
          steamUserOwnsApp={steamUserOwnsApp}
          formError={actionData?.formError}
          fieldErrors={actionData?.fieldErrors}
          fields={actionData?.fields}
        />
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>Error in /apps/$appid/performance-posts route</h1>
      <div>{error.message}</div>
    </div>
  );
}
