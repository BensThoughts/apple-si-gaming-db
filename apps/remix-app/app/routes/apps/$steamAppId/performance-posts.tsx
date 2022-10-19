import type { LoaderArgs, ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useActionData, useCatch, useLoaderData, useMatches, useTransition } from '@remix-run/react';
import PerformancePostForm from '~/components/AppInfo/PerformancePosts/PerformancePostForm';
import PerformancePostLayout from '~/components/AppInfo/PerformancePosts/PerformancePostLayout';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import type { PerformancePost } from '~/interfaces/database';
import { createPerformancePost, findPerformancePostsBySteamAppId } from '~/models/performancePost.server';
import { findPostTags } from '~/models/postTag.server';
import type { SerializedRootLoaderData } from '~/root';
import PageWrapper from '~/components/Layout/PageWrapper';
import { doesSteamUserOwnApp } from '~/models/steamUser.server';
import {
  validatePostText,
  isTypeFrameRateAverage,
  validatePostFrameRateAverage,
  isTypeRatingMedal,
  validatePostRatingMedal,
  validatePostTagIds,
} from '~/lib/form-validators/posts';
import { validateSystemName } from '~/lib/form-validators/profile';

// These are all possible tags that can be used when
// creating a performance post
interface UserSelectPostTag {
  postTagId: number;
  description: string;
}
interface PerformancePostLoaderData {
  steamUserData: {
    isLoggedIn: boolean;
    ownsApp: boolean;
    postTags: UserSelectPostTag[]
  }
  steamAppId: PerformancePost['steamAppId'];
  performancePosts: {
    id: PerformancePost['id'];
    postText: PerformancePost['postText'];
    postTags: UserSelectPostTag[],
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
  if (!params.steamAppId) {
    throw new Response('Expected params.steamAppid');
  }
  const steamAppId = Number(params.steamAppId);
  if (!isFinite(steamAppId) || steamAppId < 0) {
    throw new Response('steam appid must be a valid positive number');
  }
  const steamUser = extractAppLoadContext(context).steamUser;
  const performancePosts = await findPerformancePostsBySteamAppId(steamAppId);

  let isLoggedIn = false;
  let ownsApp = false;
  let postTags: {
    postTagId: number;
    description: string;
  }[] = [];
  if (steamUser) {
    isLoggedIn = true;
    ownsApp = await doesSteamUserOwnApp(steamUser.steamUserId, steamAppId);
    postTags = await findPostTags();
  }
  return json<PerformancePostLoaderData>({
    steamUserData: {
      isLoggedIn,
      ownsApp,
      postTags,
    },
    steamAppId,
    performancePosts,
  });
}

export type CreatePerformancePostActionData = {
  formError?: string;
  fieldErrors?: {
    postText?: string | undefined;
    frameRateAverage?: string | undefined;
    ratingMedal?: string | undefined;
    systemName?: string | undefined;
    postTags?: string | undefined;
  };
  fields?: {
    postText: PerformancePost['postText'];
  };
};

const badRequest = (data: CreatePerformancePostActionData) => json(data, { status: 400 });


export async function action({
  request,
  params,
  context,
}: ActionArgs) {
  if (!params.steamAppId) {
    throw new Response('Expected params.steamAppid');
  }
  const steamAppId = Number(params.steamAppId);
  if (!isFinite(steamAppId) || steamAppId < 0) {
    throw new Response('steam appid must be a valid positive number');
  }
  const { steamUser } = extractAppLoadContext(context);
  if (!steamUser) {
    return badRequest({ formError: 'You must be logged in to post' });
  }
  const steamUserId = steamUser.steamUserId;
  const displayName = steamUser.displayName;
  const avatarMedium = steamUser.avatarMedium;
  const formData = await request.formData();
  const postText = formData.get('performancePostText');
  const frameRateAverage = formData.get('performancePostFrameRateAverage[value]');
  const frameRateStutters = formData.get('performancePostFrameRateStutters');
  const ratingMedal = formData.get('performancePostRatingMedal[value]');
  const systemName = formData.get('performancePostSystemName[value]');
  const postTagIdsData = formData.getAll('performancePostTags');

  if (
    typeof postText !== 'string' ||
    typeof frameRateAverage !== 'string' ||
    typeof ratingMedal !== 'string' ||
    typeof systemName !== 'string' ||
    postTagIdsData.some((tagId) => typeof tagId !== 'string')
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }


  let postTagIds: number[] = [];
  if (postTagIdsData[0] !== '') {
    postTagIds = postTagIdsData.map((tagId) => Number(tagId.toString()));
  }

  const fieldErrors = {
    postText: validatePostText(postText),
    ratingMedal: validatePostRatingMedal(ratingMedal),
    postTags: validatePostTagIds(postTagIds),
    frameRateAverage: validatePostFrameRateAverage(frameRateAverage),
    systemName: validateSystemName(systemName),
  };
  const fields = {
    postText,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  // This should never return true (used for Typescript type validation)
  if (
    frameRateAverage !== 'None' &&
    !isTypeFrameRateAverage(frameRateAverage)
  ) {
    return badRequest({ fieldErrors, fields });
  }

  // This should never return true (used for Typescript type validation)
  if (!isTypeRatingMedal(ratingMedal)) {
    return badRequest({ fieldErrors, fields });
  }

  await createPerformancePost({
    steamUserId,
    avatarMedium,
    displayName,
    steamAppId,
    postText,
    frameRateAverage: frameRateAverage === 'None' ? undefined : frameRateAverage,
    frameRateStutters: frameRateStutters ? true : false,
    ratingMedal,
    systemName,
    postTagIds,
  });

  return redirect(`/apps/${steamAppId}/performance-posts`);
}


export default function PerformancePostsRoute() {
  const {
    steamUserData,
    steamAppId,
    performancePosts,
  } = useLoaderData<PerformancePostLoaderData>();
  const {
    isLoggedIn,
    ownsApp,
    postTags,
  } = steamUserData;
  const matches = useMatches();
  const rootLoaderData = matches[0].data as SerializedRootLoaderData;
  const { prismaData } = rootLoaderData;
  // let ownsApp = false;
  let systemNames: string[] = [];
  if (prismaData && isLoggedIn) {
    systemNames = prismaData.systemSpecs.map((systemSpec) => systemSpec.systemName);
  }

  const actionData = useActionData<CreatePerformancePostActionData>();
  const transition = useTransition();
  const isSubmittingPerformancePost =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_performancePostAction') === 'createPost';


  return (
    <div className="flex flex-col gap-3">
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
          steamUser={{ isLoggedIn, ownsApp, systemNames }}
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
    <PageWrapper>
      <h1>Error in /apps/$appid/performance-posts route</h1>
      <div>{error.message}</div>
    </PageWrapper>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <PageWrapper title="Oops!">
      <div>
        <h1>Oops! - {caught.status} - {caught.data}</h1>
        {caught.status === 404 && (
          <img
            src="/svg-images/four-oh-four-error.svg"
            alt="Four oh four error"
          />
        )}
      </div>
    </PageWrapper>
  );
}
