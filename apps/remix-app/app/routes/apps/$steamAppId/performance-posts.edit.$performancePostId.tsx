import { json, redirect } from '@remix-run/node';
import type { ActionArgs } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import type {
  PerformancePostBase,
  PerformancePostLikes,
  PerformancePostRating,
  PerformancePostSteamApp,
  PerformancePostSystem,
  PerformancePostTag,
  PerformancePostUserWhoCreated,
  SystemSpecOption,
} from '~/interfaces';
import { validatePerformancePostId, validateSteamAppId } from '~/lib/loader-functions/params-validators.server';
import { didCurrentSessionUserCreatePost, findPerformancePostById } from '~/models/SteamedApples/performancePost.server';
import { useActionData, useLoaderData, useTransition } from '@remix-run/react';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { findPostTags } from '~/models/SteamedApples/performancePostTag.server';
import { findAllGamepads } from '~/models/SteamedApples/gamepadMetadata.server';
// import { doesSteamUserOwnApp } from '~/models/steamUser.server';
import { useUserLikedPostIds, useUserSystemSpecs } from '~/lib/hooks/useMatchesData';
import EditPerformancePostForm from '~/components/AppInfo/PerformancePosts/PerformancePostForms/EditPerformancePostForm';
import PerformancePostDisplay from '~/components/AppInfo/PerformancePosts/PerformancePostDisplay';
import PostLayoutCard from '~/components/AppInfo/PerformancePosts/PerformancePostLayoutCard';
import { editPerformancePostAction } from '~/lib/form-actions/performance-post/edit-post.server';
import type { PostTagOption, GamepadOption } from '~/interfaces';
import type { CreateOrEditPerformancePostActionData } from '~/lib/form-actions/performance-post/create-or-edit-action-type';

type EditPostLoaderData = {
  steamAppId: number;
  userSession: {
    isLoggedIn: boolean;
    loggedInUserCreatedPost: boolean;
  };
  performancePost: PerformancePostBase & {
    steamApp: PerformancePostSteamApp;
    rating: PerformancePostRating;
    likes: PerformancePostLikes;
    system: PerformancePostSystem;
    userWhoCreatedPost: PerformancePostUserWhoCreated;
    postTags: PerformancePostTag[];
  };
  postTagOptions: PostTagOption[];
  gamepadOptions: GamepadOption[];
}

export async function loader({ params, context }: LoaderArgs) {
  const steamAppId = validateSteamAppId(params);
  const performancePostId = validatePerformancePostId(params);
  const steamUser = extractAppLoadContext(context).steamUser;
  if (!steamUser) {
    return redirect(`/apps/${steamAppId}/performance-posts/`);
  }
  const steamUserId64 = steamUser.steamUserId64;
  const isLoggedIn = true;
  const loggedInUserCreatedPost = await didCurrentSessionUserCreatePost(steamUserId64, performancePostId);
  if (!loggedInUserCreatedPost) {
    return redirect(`/apps/${steamAppId}/performance-posts/`);
  }
  // const ownsApp = await doesSteamUserOwnApp(steamUserId, steamAppId);
  // if (!ownsApp) {
  //   return redirect(`/apps/${steamAppId}/performance-posts/`);
  // }

  const postTagOptions: PostTagOption[] = await findPostTags();
  const gamepadOptions: GamepadOption[] = await findAllGamepads();
  const performancePost = await findPerformancePostById(performancePostId);
  if (!performancePost) {
    throw Error(`Post with ${performancePostId} not found in database`);
  }
  const {
    id,
    postText,
    createdAt,
    _count: {
      usersWhoLiked,
    },
    steamApp: {
      name,
    },
    steamUserProfile: {
      displayName,
      avatarMedium,
    },
    ratingMedal,
    frameRateAverage,
    frameRateStutters,
    gamepadRating,
    gamepadMetadata,
    postTags,
    systemManufacturer,
    systemModel,
    systemOsVersion,
    systemCpuBrand,
    systemVideoDriver,
    systemVideoDriverVersion,
    systemVideoPrimaryVRAM,
    systemMemoryRAM,
  } = performancePost;
  return json<EditPostLoaderData>({
    steamAppId,
    userSession: {
      isLoggedIn,
      loggedInUserCreatedPost,
    },
    performancePost: {
      performancePostId: id,
      postText,
      createdAt,
      steamApp: {
        steamAppId,
        name,
      },
      rating: {
        ratingMedal,
        frameRateAverage,
        frameRateStutters,
        gamepadRating,
        gamepadMetadata,
      },
      likes: {
        numLikes: usersWhoLiked,
      },
      userWhoCreatedPost: {
        steamUserId64,
        displayName,
        avatarMedium,
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
      postTags,
    },
    postTagOptions,
    gamepadOptions,
  });
}

export async function action({
  request,
  params,
  context,
}: ActionArgs) {
  const steamAppId = validateSteamAppId(params);
  const performancePostId = validatePerformancePostId(params);
  const steamUser = extractAppLoadContext(context).steamUser;
  if (!steamUser) {
    return redirect(`/apps/${steamAppId}/performance-posts/`);
  }
  const steamUserId64 = steamUser.steamUserId64;
  const loggedInUserCreatedPost = await didCurrentSessionUserCreatePost(steamUserId64, performancePostId);
  if (!loggedInUserCreatedPost) {
    return redirect(`/apps/${steamAppId}/performance-posts/`);
  }
  const formData = await request.formData();
  return editPerformancePostAction({
    steamAppId,
    performancePostId,
    formData,
  });
}

export default function EditPerformancePostRoute() {
  const loaderData = useLoaderData<EditPostLoaderData>();
  const {
    performancePost,
    userSession: {
      isLoggedIn,
      loggedInUserCreatedPost,
    },
    steamAppId,
    postTagOptions,
    gamepadOptions,
  } = loaderData;

  const {
    performancePostId,
    postText,
    rating,
    postTags,
  } = performancePost;

  const likedPerformancePostIds = useUserLikedPostIds();
  const hasLoggedInUserLiked = likedPerformancePostIds.includes(performancePostId);

  const systemSpecs = useUserSystemSpecs();
  const systemSpecOptions: SystemSpecOption[] = systemSpecs.map((systemSpec) => ({
    id: systemSpec.systemSpecId,
    systemName: systemSpec.systemName,
  }));

  const actionData = useActionData<CreateOrEditPerformancePostActionData>();
  const transition = useTransition();
  const isSubmittingEditPerformancePost =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_performancePostAction') === 'editPerformancePost';


  return (
    <div className="flex flex-col gap-3">

      <PostLayoutCard>
        <PerformancePostDisplay
          userSession={{
            isUserLoggedIn: isLoggedIn,
            hasLoggedInUserLiked,
            didLoggedInUserCreatePost: loggedInUserCreatedPost,
          }}
          performancePost={{
            ...performancePost,
            createdAt: new Date(performancePost.createdAt),
          }}
        />
      </PostLayoutCard>

      <EditPerformancePostForm
        performancePostId={performancePostId}
        steamAppId={steamAppId}
        steamUserSession={{ isLoggedIn, loggedInUserCreatedPost, systemSpecOptions }}
        formError={actionData?.formError}
        fieldErrors={actionData?.fieldErrors}
        fields={actionData?.fields ? actionData.fields : {
          postText,
          ratingMedal: rating.ratingMedal,
          frameRateAverage: rating.frameRateAverage,
          frameRateStutters: rating.frameRateStutters ? rating.frameRateStutters : false,
          gamepadId: rating.gamepadMetadata?.id,
          gamepadRating: rating.gamepadRating,
          postTagsIds: postTags.map((tag) => tag.id),
        }}
        isSubmittingForm={isSubmittingEditPerformancePost}
        postTagOptions={postTagOptions}
        gamepadOptions={gamepadOptions}
      />
    </div>
  );
}
