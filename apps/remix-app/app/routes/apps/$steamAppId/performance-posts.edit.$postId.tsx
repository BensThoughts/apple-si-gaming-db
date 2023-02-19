import { json, redirect } from '@remix-run/node';
import type { ActionArgs } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import type { FrameRate, GamepadRating, PerformancePostBase, PerformancePostLikes, PerformancePostRating, PerformancePostSteamApp, PerformancePostSystem, PerformancePostTag, PerformancePostUserWhoCreated, RatingMedal } from '~/interfaces';
import { validatePostId, validateSteamAppId } from '~/lib/loader-functions/params-validators.server';
import { didCurrentSessionUserCreatePost, findPerformancePostByPostId } from '~/models/steamPerformancePost.server';
import { useActionData, useLoaderData, useTransition } from '@remix-run/react';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { findPostTags } from '~/models/postTag.server';
import { findAllGamepads } from '~/models/gamepadMetadata.server';
// import { doesSteamUserOwnApp } from '~/models/steamUser.server';
import { useSteamUserLikedPostIds, useSteamUserSystemSpecs } from '~/lib/hooks/useMatchesData';
import EditPerformancePostForm from '~/components/AppInfo/PerformancePosts/PerformancePostForms/EditPerformancePostForm';
import PerformancePostDisplay from '~/components/AppInfo/PerformancePosts/PerformancePostDisplay';
import PostLayoutCard from '~/components/AppInfo/PerformancePosts/PerformancePostLayoutCard';
import { editPerformancePostAction } from '~/lib/form-actions/performance-post/edit-post.server';
import type { PostTagOption, GamepadOption } from '~/interfaces';

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
  const postId = validatePostId(params);
  const steamUser = extractAppLoadContext(context).steamUser;
  if (!steamUser) {
    return redirect(`/apps/${steamAppId}/performance-posts/`);
  }
  const steamUserId = steamUser.steamUserId;
  const isLoggedIn = true;
  const loggedInUserCreatedPost = await didCurrentSessionUserCreatePost(steamUserId, postId);
  if (!loggedInUserCreatedPost) {
    return redirect(`/apps/${steamAppId}/performance-posts/`);
  }
  // const ownsApp = await doesSteamUserOwnApp(steamUserId, steamAppId);
  // if (!ownsApp) {
  //   return redirect(`/apps/${steamAppId}/performance-posts/`);
  // }

  const postTagOptions: PostTagOption[] = await findPostTags();
  const gamepadOptions: GamepadOption[] = await findAllGamepads();
  const performancePost = await findPerformancePostByPostId(postId);
  if (!performancePost) {
    throw Error(`Post with ${postId} not found in database`);
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
    ratingMedal,
    frameRateAverage,
    frameRateStutters,
    gamepadRating,
    gamepadMetadata,
    postTags,
    displayName,
    avatarMedium,
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
      postId: id,
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
        steamUserId,
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

export type EditPerformancePostActionData = {
  formError?: string;
  fields?: { // used for defaultValue options
    postText?: string;
    frameRateAverage?: FrameRate | null;
    frameRateStutters?: boolean;
    ratingMedal?: RatingMedal;
    // systemName?: string;
    postTagsIds?: number[];
    gamepadId?: number;
    gamepadRating?: GamepadRating | null;
  };
  fieldErrors?: {
    postText?: string;
    frameRateAverage?: string;
    ratingMedal?: string;
    systemName?: string;
    postTags?: string;
    gamepadId?: string;
    gamepadRating?: string;
  };
};

export async function action({
  request,
  params,
  context,
}: ActionArgs) {
  const steamAppId = validateSteamAppId(params);
  const postId = validatePostId(params);
  const steamUser = extractAppLoadContext(context).steamUser;
  if (!steamUser) {
    return redirect(`/apps/${steamAppId}/performance-posts/`);
  }
  const steamUserId = steamUser.steamUserId;
  const formData = await request.formData();
  return editPerformancePostAction({
    steamUserId,
    steamAppId,
    postId,
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
    postId,
    postText,
    rating,
    postTags,
  } = performancePost;

  const likedPerformancePostIds = useSteamUserLikedPostIds();
  const hasLoggedInUserLiked = likedPerformancePostIds.includes(postId);

  const systemSpecs = useSteamUserSystemSpecs();
  let systemNames: string[] = [];
  if (systemSpecs && isLoggedIn) {
    systemNames = systemSpecs.map((systemSpec) => systemSpec.systemName);
  }

  const actionData = useActionData<EditPerformancePostActionData>();
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
        postId={postId}
        steamAppId={steamAppId}
        steamUserSession={{ isLoggedIn, loggedInUserCreatedPost, systemNames }}
        formError={actionData?.formError}
        fieldErrors={actionData?.fieldErrors}
        fields={actionData?.fields ? actionData.fields : {
          postText,
          ratingMedal: rating.ratingMedal,
          frameRateAverage: rating.frameRateAverage,
          frameRateStutters: rating.frameRateStutters ? rating.frameRateStutters : false,
          gamepadId: rating.gamepadMetadata?.gamepadId,
          gamepadRating: rating.gamepadRating,
          postTagsIds: postTags.map((tag) => tag.postTagId),
        }}
        isSubmittingForm={isSubmittingEditPerformancePost}
        postTagOptions={postTagOptions}
        gamepadOptions={gamepadOptions}
      />
    </div>
  );
}
