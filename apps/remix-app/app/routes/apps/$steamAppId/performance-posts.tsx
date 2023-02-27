import type { LoaderArgs, ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useActionData, useCatch, useLoaderData, useTransition } from '@remix-run/react';
import PerformancePostLayout from '~/components/AppInfo/PerformancePosts/PerformancePostLayout';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
// import type { GamepadRating, RatingMedal, FrameRate } from '~/interfaces/database';
import { findPerformancePostsBySteamAppId } from '~/models/SteamedApples/performancePost.server';
import { findPostTags } from '~/models/SteamedApples/performancePostTag.server';
import { doesSteamUserOwnApp } from '~/models/Steam/steamUserProfile.server';
import { validateSteamAppId } from '~/lib/loader-functions/params-validators.server';
import { findAllGamepads } from '~/models/SteamedApples/gamepadMetadata.server';
import { useUserLikedPostIds, useUserSystemSpecs } from '~/lib/hooks/useMatchesData';
import { createPerformancePostAction } from '~/lib/form-actions/performance-post/create-post.server';
import { deletePerformancePostAction } from '~/lib/form-actions/performance-post/delete-post.server';
import type { PerformancePostBase, PerformancePostLikes, PerformancePostRating, PerformancePostSteamApp, PerformancePostSystem, PerformancePostTag, PerformancePostUserWhoCreated, SystemSpecOption } from '~/interfaces';
import CreatePerformancePostForm from '~/components/AppInfo/PerformancePosts/PerformancePostForms/CreatePerformancePostForm';
import type { PostTagOption, GamepadOption } from '~/interfaces';
import type { CreateOrEditPerformancePostActionData } from '~/lib/form-actions/performance-post/create-or-edit-action-type';

interface PerformancePostLoaderData {
  steamAppId: number;
  userSession: {
    isLoggedIn: boolean;
    steamUserId64?: string;
    ownsApp: boolean;
  };
  performancePosts: (PerformancePostBase & {
    steamApp: PerformancePostSteamApp;
    rating: PerformancePostRating;
    likes: PerformancePostLikes;
    userWhoCreatedPost: PerformancePostUserWhoCreated;
    system: PerformancePostSystem;
    postTags: PerformancePostTag[];
  })[];
  postTagOptions: PostTagOption[];
  gamepadOptions: GamepadOption[];
}

export async function loader({ params, context }: LoaderArgs) {
  const steamAppId = validateSteamAppId(params);
  const steamUser = extractAppLoadContext(context).steamUser;
  const performancePosts =
    (await findPerformancePostsBySteamAppId(steamAppId))
        .map(({
          id,
          steamUserProfile: {
            steamUserId64,
            displayName,
            avatarMedium,
          },
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
          performancePostId: id,
          createdAt,
          userWhoCreatedPost: {
            steamUserId64: steamUserId64.toString(),
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
  let steamUserId64: string | undefined = undefined;
  let ownsApp = false;
  let postTagOptions: PostTagOption[] = [];
  let gamepadOptions: GamepadOption[] = [];
  if (steamUser) {
    isLoggedIn = true;
    steamUserId64 = steamUser.steamUserId64;
    ownsApp = await doesSteamUserOwnApp(steamUserId64, steamAppId);
    postTagOptions = await findPostTags();
    gamepadOptions = await findAllGamepads();
  }
  return json<PerformancePostLoaderData>({
    steamAppId,
    userSession: {
      isLoggedIn,
      steamUserId64,
      ownsApp,
    },
    performancePosts,
    postTagOptions,
    gamepadOptions,
  });
}

// export type CreatePerformancePostActionData = {
//   formError?: string;
//   fieldErrors?: {
//     postText?: string;
//     frameRateAverage?: string;
//     ratingMedal?: string;
//     systemName?: string;
//     postTags?: string;
//     gamepadId?: string;
//     gamepadRating?: string;
//   };
//   fields?: {
//     postText: string;
//   };
// };

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
  const steamUserId64 = steamUser.steamUserId64;
  const displayName = steamUser.displayName;
  const avatarMedium = steamUser.avatarMedium;
  const formData = await request.formData();
  const action = formData.get('_performancePostAction');

  switch (action) {
    case 'createPerformancePost': {
      return createPerformancePostAction({
        steamAppId,
        steamUserId64,
        displayName,
        avatarMedium,
        formData,
      });
    }
    case 'deletePerformancePost': {
      return deletePerformancePostAction(steamUserId64, steamAppId, formData);
    }
    default: {
      throw new Error(`Unexpected action in /apps/${steamAppId}/performance-posts`);
    }
  }
}


export default function PerformancePostsRoute() {
  const {
    userSession,
    steamAppId,
    performancePosts,
    postTagOptions,
    gamepadOptions,
  } = useLoaderData<PerformancePostLoaderData>();
  const {
    isLoggedIn,
    steamUserId64,
    ownsApp,
  } = userSession;
  const systemSpecs = useUserSystemSpecs();
  const systemSpecOptions: SystemSpecOption[] = systemSpecs.map((systemSpec) => ({
    id: systemSpec.systemSpecId,
    systemName: systemSpec.systemName,
  }));
  // const systemNames = systemSpecs.map((systemSpec) => systemSpec.systemName);

  const likedPerformancePostIds = useUserLikedPostIds();

  // TODO: useActionData type is wrong, what is DeletePostActionData
  // TODO: is passed through?
  const actionData = useActionData<CreateOrEditPerformancePostActionData>();
  const transition = useTransition();
  const isSubmittingCreatePerformancePost =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_performancePostAction') === 'createPost';

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full">
        <PerformancePostLayout
          userSession={{
            isUserLoggedIn: isLoggedIn,
            steamUserId64,
            likedPerformancePostIds,
          }}
          performancePosts={performancePosts.map((post) => ({
            ...post,
            createdAt: new Date(post.createdAt),
          }))}
        />
      </div>
      <div className="w-full">
        <CreatePerformancePostForm
          steamAppId={steamAppId}
          userSession={{ isLoggedIn, ownsApp, systemSpecOptions }}
          formError={actionData?.formError}
          fieldErrors={actionData?.fieldErrors}
          fields={actionData?.fields}
          isSubmittingForm={isSubmittingCreatePerformancePost}
          postTagOptions={postTagOptions}
          gamepadOptions={gamepadOptions}
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
