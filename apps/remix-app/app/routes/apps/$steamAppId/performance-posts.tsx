import type { LoaderArgs, ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useActionData, useCatch, useLoaderData, useTransition } from '@remix-run/react';
import PerformancePostForm from '~/components/AppInfo/PerformancePosts/PerformancePostForm';
import PerformancePostLayout from '~/components/AppInfo/PerformancePosts/PerformancePostLayout';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
// import type { GamepadRating, RatingMedal, FrameRate } from '~/interfaces/database';
import { findPerformancePostsBySteamAppId } from '~/models/steamPerformancePost.server';
import { findPostTags } from '~/models/postTag.server';
import { doesSteamUserOwnApp } from '~/models/steamUser.server';
import { validateSteamAppId } from '~/lib/loader-functions/params-validators.server';
import { findAllGamepads } from '~/models/gamepadMetadata.server';
import { useSteamUserLikedPostIds, useSteamUserSystemSpecs } from '~/lib/hooks/useMatchesData';
import { createPerformancePostAction } from '~/lib/form-actions/performance-post/create-post.server';
import { deletePerformancePostAction } from '~/lib/form-actions/performance-post/delete-post.server';
import type { PerformancePostBase, PerformancePostLikes, PerformancePostRating, PerformancePostSteamApp, PerformancePostSystem, PerformancePostTag, PerformancePostUserWhoCreated } from '~/interfaces';

// These are all possible tags that can be used when
// creating a performance post
interface UserSelectPostTag {
  postTagId: number;
  description: string;
}

interface UserSelectGamepad {
  gamepadId: number;
  description: string;
}
interface PerformancePostLoaderData {
  steamUserData: {
    isLoggedIn: boolean;
    steamUserId?: string;
    ownsApp: boolean;
    postTags: UserSelectPostTag[];
    gamepads: UserSelectGamepad[];
  }
  steamAppId: number;
  performancePosts: (PerformancePostBase & {
    steamApp: PerformancePostSteamApp;
    rating: PerformancePostRating;
    likes: PerformancePostLikes;
    userWhoCreatedPost: PerformancePostUserWhoCreated;
    system: PerformancePostSystem;
    postTags: PerformancePostTag[];
  })[];
}

export async function loader({ params, context }: LoaderArgs) {
  const steamAppId = validateSteamAppId(params);
  const steamUser = extractAppLoadContext(context).steamUser;
  const performancePosts =
    (await findPerformancePostsBySteamAppId(steamAppId))
        .map(({
          id,
          steamUserId,
          displayName,
          avatarMedium,
          createdAt,
          postText,
          _count: {
            usersWhoLiked,
          },
          postTags,
          ratingMedal,
          frameRateAverage,
          frameRateStutters,
          gamepadRating,
          gamepadMetadata,
          steamApp: {
            name,
          },
          systemManufacturer,
          systemModel,
          systemOsVersion,
          systemCpuBrand,
          systemVideoDriver,
          systemVideoDriverVersion,
          systemVideoPrimaryVRAM,
          systemMemoryRAM,
        }) => ({
          postId: id,
          createdAt,
          userWhoCreatedPost: {
            steamUserId,
            displayName,
            avatarMedium,
          },
          postText,
          likes: {
            numLikes: usersWhoLiked,
          },
          postTags,
          rating: {
            ratingMedal,
            frameRateAverage,
            frameRateStutters,
            gamepadRating,
            gamepadMetadata,
          },
          steamApp: {
            steamAppId,
            name,
          },
          system: {
            manufacturer: systemManufacturer,
            model: systemModel,
            osVersion: systemOsVersion,
            cpuBrand: systemCpuBrand,
            videoDriver: systemVideoDriver,
            videoDriverVersion: systemVideoDriverVersion,
            videoPrimaryVRAM: systemVideoPrimaryVRAM,
            memoryRAM: systemMemoryRAM,
          },
        }));

  let isLoggedIn = false;
  let steamUserId: string | undefined = undefined;
  let ownsApp = false;
  let postTags: UserSelectPostTag[] = [];
  let gamepads: UserSelectGamepad[] = [];
  if (steamUser) {
    isLoggedIn = true;
    steamUserId = steamUser.steamUserId;
    ownsApp = await doesSteamUserOwnApp(steamUser.steamUserId, steamAppId);
    postTags = await findPostTags();
    gamepads = await findAllGamepads();
  }
  return json<PerformancePostLoaderData>({
    steamUserData: {
      isLoggedIn,
      steamUserId,
      ownsApp,
      postTags,
      gamepads,
    },
    steamAppId,
    performancePosts,
  });
}

export type CreatePerformancePostActionData = {
  formError?: string;
  fieldErrors?: {
    postText?: string;
    frameRateAverage?: string;
    ratingMedal?: string;
    systemName?: string;
    postTags?: string;
    gamepadId?: string;
    gamepadRating?: string;
  };
  fields?: {
    postText: string;
  };
};

export type DeletePerformancePostActionData = {
  formError?: string;
  fields?: {
    postId: string;
  }
}


export async function action({
  request,
  params,
  context,
}: ActionArgs) {
  const steamAppId = validateSteamAppId(params);
  const { steamUser } = extractAppLoadContext(context);
  if (!steamUser) {
    return redirect(`/apps/${steamAppId}/performance-posts`);
  }
  const steamUserId = steamUser.steamUserId;
  const displayName = steamUser.displayName;
  const avatarMedium = steamUser.avatarMedium;
  const formData = await request.formData();
  const action = formData.get('_performancePostAction');

  switch (action) {
    case 'createPerformancePost': {
      return createPerformancePostAction({
        steamAppId,
        steamUserId,
        displayName,
        avatarMedium,
        formData,
      });
    }
    case 'deletePerformancePost': {
      return deletePerformancePostAction(steamUserId, steamAppId, formData);
    }
    default: {
      throw new Error(`Unexpected action in /apps/${steamAppId}/performance-posts`);
    }
  }
}


export default function PerformancePostsRoute() {
  const {
    steamUserData,
    steamAppId,
    performancePosts,
  } = useLoaderData<PerformancePostLoaderData>();
  const {
    isLoggedIn,
    steamUserId,
    ownsApp,
    postTags,
    gamepads,
  } = steamUserData;
  const systemSpecs = useSteamUserSystemSpecs();
  const steamUserLikedPostIds = useSteamUserLikedPostIds();
  const likedPerformancePostIds = steamUserLikedPostIds ? steamUserLikedPostIds : [];

  let systemNames: string[] = [];
  if (systemSpecs && isLoggedIn) {
    systemNames = systemSpecs.map((systemSpec) => systemSpec.systemName);
  }

  const actionData = useActionData<CreatePerformancePostActionData>();
  const transition = useTransition();
  const isSubmittingPerformancePost =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_performancePostAction') === 'createPost';

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full">
        <PerformancePostLayout
          userSession={{
            isUserLoggedIn: isLoggedIn,
            steamUserId,
            likedPerformancePostIds,
          }}
          performancePosts={performancePosts.map((post) => ({
            ...post,
            createdAt: new Date(post.createdAt),
          }))}
        />
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
          gamepads={gamepads}
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
  const caught = useCatch();
  return (
    <div>
      <h1>Oops! - {caught.status} - {caught.data}</h1>
      <p>Error in /apps/$steamAppId/performance-posts route</p>
    </div>
  );
}
