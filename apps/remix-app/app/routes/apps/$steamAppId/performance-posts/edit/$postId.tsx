import { json } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import type { PerformancePostBase, PerformancePostRating, PerformancePostTag } from '~/interfaces';
import { validatePostId, validateSteamAppId } from '~/lib/loader-functions/params-validators.server';
import { findPerformancePostByPostId } from '~/models/steamPerformancePost.server';
import { useLoaderData } from '@remix-run/react';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { findPostTags } from '~/models/postTag.server';
import { findAllGamepads } from '~/models/gamepadMetadata.server';
import { doesSteamUserOwnApp } from '~/models/steamUser.server';
import { useSteamUserSystemSpecs } from '~/lib/hooks/useMatchesData';
import EditPerformancePostForm from '~/components/AppInfo/PerformancePosts/PerformancePostForms/EditPerformancePostForm';

interface UserSelectPostTag {
  postTagId: number;
  description: string;
}

interface UserSelectGamepad {
  gamepadId: number;
  description: string;
}

type EditPostLoaderData = {
  steamAppId: number;
  userSession: {
    isLoggedIn: boolean;
    steamUserId?: string;
    ownsApp: boolean;
  };
  performancePost: PerformancePostBase & {
    rating: PerformancePostRating;
    postTags: PerformancePostTag[];
  };
  postTagOptions: UserSelectPostTag[];
  gamepadOptions: UserSelectGamepad[];
}

export async function loader({ params, context }: LoaderArgs) {
  const steamAppId = validateSteamAppId(params);
  const postId = validatePostId(params);
  const steamUser = extractAppLoadContext(context).steamUser;
  let isLoggedIn = false;
  let steamUserId: string | undefined = undefined;
  let ownsApp = false;
  let postTagOptions: UserSelectPostTag[] = [];
  let gamepadOptions: UserSelectGamepad[] = [];
  if (steamUser) {
    isLoggedIn = true;
    steamUserId = steamUser.steamUserId;
    ownsApp = await doesSteamUserOwnApp(steamUser.steamUserId, steamAppId);
    postTagOptions = await findPostTags();
    gamepadOptions = await findAllGamepads();
  }
  const performancePost = await findPerformancePostByPostId(postId);
  if (!performancePost) {
    throw Error(`Post with ${postId} not found`);
  }
  const {
    postText,
    createdAt,
    ratingMedal,
    frameRateAverage,
    frameRateStutters,
    gamepadRating,
    gamepadMetadata,
    postTags,
  } = performancePost;
  return json<EditPostLoaderData>({
    steamAppId,
    userSession: {
      isLoggedIn,
      steamUserId,
      ownsApp,
    },
    performancePost: {
      postId,
      postText,
      createdAt,
      rating: {
        ratingMedal,
        frameRateAverage,
        frameRateStutters,
        gamepadRating,
        gamepadMetadata,
      },
      postTags,
    },
    postTagOptions,
    gamepadOptions,
  });
}

export default function EditPerformancePostRoute() {
  const loaderData = useLoaderData<EditPostLoaderData>();
  const {
    performancePost: {
      postId,
      postText,
      rating,
      postTags,
    },
    userSession: {
      isLoggedIn,
      ownsApp,
    },
    steamAppId,
    postTagOptions,
    gamepadOptions,
  } = loaderData;

  const systemSpecs = useSteamUserSystemSpecs();
  let systemNames: string[] = [];
  if (systemSpecs && isLoggedIn) {
    systemNames = systemSpecs.map((systemSpec) => systemSpec.systemName);
  }

  return (
    <div>
      <EditPerformancePostForm
        postId={postId}
        steamAppId={steamAppId}
        steamUserSession={{ isLoggedIn, ownsApp, systemNames }}
        formError={undefined}
        fieldErrors={undefined}
        fields={{
          postText,
          ratingMedal: rating.ratingMedal,
          frameRateAverage: rating.frameRateAverage,
          frameRateStutters: rating.frameRateStutters ? rating.frameRateStutters : false,
          gamepadId: rating.gamepadMetadata?.gamepadId,
          gamepadRating: rating.gamepadRating,
          postTagsIds: postTags.map((tag) => tag.postTagId),
        }}
        isSubmittingForm={false}
        postTagOptions={postTagOptions}
        gamepadOptions={gamepadOptions}
      />
    </div>
  );
}
