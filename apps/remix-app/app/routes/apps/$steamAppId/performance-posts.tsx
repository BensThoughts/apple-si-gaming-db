import type { LoaderArgs, ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useActionData, useLoaderData, useTransition } from '@remix-run/react';
import invariant from 'tiny-invariant';
import PerformancePostForm from '~/components/AppInfo/PerformancePosts/PerformancePostForm';
import PerformancePostLayout from '~/components/AppInfo/PerformancePosts/PerformancePostLayout';
import { convertRatingMedalStringToRatingMedal } from '~/models/performancePost.server';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import type { FrameRate, PerformancePost, PostTag, RatingMedal } from '~/interfaces/database';
import { createPerformancePost, findPerformancePostsBySteamAppId } from '~/models/performancePost.server';
import { doesSteamUserOwnApp, findSteamUserSystemNamesByUserId } from '~/models/steamUser.server';
import { findPostTags } from '~/models/postTag.server';

interface LoaderData {
  steamAppId: number;
  steamUserOwnsApp: boolean;
  steamUserIsLoggedIn: boolean;
  steamUserSystemNames: string[];
  postTags: {
    postTagId: PostTag['postTagId'];
    description: PostTag['description'];
  }[];
  performancePosts: {
    id: PerformancePost['id'];
    postText: PerformancePost['postText'];
    postTags: {
      postTagId: PostTag['postTagId'];
      description: PostTag['description'];
    }[],
    createdAt: PerformancePost['createdAt'];
    ratingMedal: PerformancePost['ratingMedal'];
    frameRateAverage: PerformancePost['frameRateAverage']
    frameRateStutters: PerformancePost['frameRateStutters'];
    displayName: PerformancePost['displayName'];
    avatarMedium: PerformancePost['avatarMedium'];
    systemManufacturer: PerformancePost['systemManufacturer'];
    systemModel: PerformancePost['systemModel'];
    systemOsVersion: PerformancePost['systemOsVersion'];
    systemCpuBrand: PerformancePost['systemCpuBrand'];
    systemVideoDriver: PerformancePost['systemVideoDriver'];
    systemVideoDriverVersion: PerformancePost['systemVideoDriverVersion'];
    systemVideoPrimaryVRAM: PerformancePost['systemVideoPrimaryVRAM'];
    systemMemoryRAM: PerformancePost['systemMemoryRAM'];
  }[];
}

export async function loader({ params, context }: LoaderArgs) {
  invariant(params.steamAppId, 'Expected params.steamAppId');
  const steamAppId = Number(params.steamAppId);
  invariant(isFinite(steamAppId), 'Expected steamAppId to be a valid number');
  const steamUser = extractAppLoadContext(context).steamUser;
  const performancePosts = await findPerformancePostsBySteamAppId(steamAppId);

  let steamUserOwnsApp = false;
  let steamUserIsLoggedIn = false;
  let steamUserSystemNames: string[] = [];
  let postTags: {
    postTagId: number;
    description: string;
  }[] = [];
  if (steamUser) {
    steamUserIsLoggedIn = true;
    steamUserOwnsApp = await doesSteamUserOwnApp(steamUser.steamUserId, steamAppId);
    const systemNames = await findSteamUserSystemNamesByUserId(steamUser.steamUserId);
    if (systemNames) {
      steamUserSystemNames = systemNames;
    }
    postTags = await findPostTags();
  }
  return json<LoaderData>({
    steamAppId,
    performancePosts,
    steamUserIsLoggedIn,
    steamUserOwnsApp,
    steamUserSystemNames,
    postTags,
  });
}

function isTypeFrameRateAverage(frameRateAverage: string): frameRateAverage is FrameRate {
  return ['VeryLow', 'Low', 'Medium', 'High', 'VeryHigh'].includes(frameRateAverage);
}

function isTypeRatingMedal(ratingMedal: string): ratingMedal is RatingMedal {
  return ['Borked', 'Bronze', 'Gold', 'Platinum', 'Silver'].includes(ratingMedal);
}

function validatePostRatingMedal(ratingMedal: string) {
  if (ratingMedal.toLowerCase() === 'none') {
    return `rating cannot be none`;
  }
  if (!isTypeRatingMedal(ratingMedal)) {
    return `${ratingMedal} is not a valid option`;
  }
}

function validatePostText(postText: string) {
  if (postText.length < 3) {
    return `The performance posts text is too short (3 character minimum)`;
  }
  if (postText.length > 1500) {
    return `The performance posts text is too long (1500 character maximum)`;
  }
}

function validatePostTagIds(postTagIds: string[]) {
  let invalidTag: string | undefined = undefined;
  if (postTagIds.some((tagId) => {
    if (
      !isFinite(Number(tagId)) ||
      Number(tagId) < 0
    ) {
      invalidTag = tagId;
      return true;
    }
    return false;
  })) {
    return `${invalidTag} is not a valid tagId`;
  }
}

export type CreatePostActionData = {
  formError?: string;
  fieldErrors?: {
    postText?: string | undefined;
    frameRateAverage?: string | undefined;
    ratingMedal?: string | undefined;
    // systemName?: string | undefined;
    postTags?: string | undefined;
  };
  fields?: {
    postText: PerformancePost['postText'];
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
  const displayName = steamUser.displayName;
  const avatarMedium = steamUser.avatarMedium;
  const formData = await request.formData();
  const postText = formData.get('performancePostText');
  const frameRateAverageValue = formData.get('performancePostFrameRateAverage[value]');
  const frameRateStutters = formData.get('performancePostFrameRateStutters');
  const ratingMedalValue = formData.get('performancePostRatingMedal[value]');
  const systemName = formData.get('performancePostSystemName[value]');
  const postTagIdsData = formData.getAll('performancePostTags');

  // TODO: Not sure if postText/ratingMedal should be string or FormDataEntryValue
  if (
    typeof postText !== 'string' ||
    typeof frameRateAverageValue !== 'string' ||
    typeof ratingMedalValue !== 'string' ||
    typeof systemName !== 'string' ||
    postTagIdsData.some((tagId) => typeof tagId !== 'string')
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }


  let postTagIds: string[] = [];
  if (postTagIdsData[0] !== '') {
    postTagIds = postTagIdsData.map((tagId) => tagId.toString());
  }


  let fieldErrors = {};
  fieldErrors = {
    postText: validatePostText(postText),
    ratingMedal: validatePostRatingMedal(ratingMedalValue),
    postTags: validatePostTagIds(postTagIds),
  };
  const fields = {
    postText,
  };
  if (
    frameRateAverageValue !== 'None' &&
    !isTypeFrameRateAverage(frameRateAverageValue)
  ) {
    fieldErrors = {
      ...fieldErrors,
      frameRateAverage: `${frameRateAverageValue} is not a valid frame rate option`,
    };
    return badRequest({ fieldErrors, fields });
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  try {
    await createPerformancePost({
      steamUserId,
      avatarMedium,
      displayName,
      steamAppId,
      postText: postText,
      frameRateAverage: frameRateAverageValue,
      frameRateStutters: frameRateStutters ? true : false,
      ratingMedal: convertRatingMedalStringToRatingMedal(ratingMedalValue),
      systemName,
      postTagIds: postTagIds.map((tagId) => Number(tagId)),
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      throw new Error('Error in createPerformancePost', { cause: err });
    }
  }

  return redirect(`/apps/${steamAppId}/performance-posts`);
}

export default function PostsRoute() {
  const {
    performancePosts,
    steamUserOwnsApp,
    steamUserIsLoggedIn,
    steamAppId,
    steamUserSystemNames,
    postTags,
  } = useLoaderData<LoaderData>();
  const actionData = useActionData<CreatePostActionData>();
  const transition = useTransition();
  const isSubmittingPerformancePost =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_performancePostAction') === 'createPost';

  return (
    <div className="flex flex-col gap-3">
      {/* <h2 className="text-xl text-primary-highlight">Performance Posts</h2> */}
      <div className="w-full">
        <PerformancePostLayout performancePosts={performancePosts.map((post) => ({
          ...post,
          // WITH JOIN TABLE
          // postTags: post.postTags.map(({ postTag }) => ({
          //   postTagId: postTag.id,
          //   description: postTag.description,
          // })),
          createdAt: new Date(post.createdAt),
        }))} />
      </div>
      <div className="w-full">
        <PerformancePostForm
          steamAppId={steamAppId}
          steamUserIsLoggedIn={steamUserIsLoggedIn}
          steamUserOwnsApp={steamUserOwnsApp}
          steamUserSystemNames={steamUserSystemNames}
          formError={actionData?.formError}
          fieldErrors={actionData?.fieldErrors}
          fields={actionData?.fields}
          isSubmittingForm={isSubmittingPerformancePost}
          postTags={postTags}
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

export function CatchBoundary() {

}
