import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useActionData, useCatch, useLoaderData, useMatches, useTransition } from '@remix-run/react';
import PageWrapper from '~/components/Layout/PageWrapper';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { findGamepadPostsBySteamAppId, createGamepadPost } from '~/models/steamGamepadPost.server';
import { findPostTags } from '~/models/postTag.server';
import type { PostTag, SteamGamepad, SteamGamepadPost } from '~/interfaces/database';
import { findGamePads } from '~/models/steamGamepad.server';
import { json } from '@remix-run/node';
import type { SerializedRootLoaderData } from '~/root';
import GamepadPostForm from '~/components/AppInfo/GamepadPosts/GamepadPostForm';
import { doesSteamUserOwnApp } from '~/models/steamUser.server';
import GamepadPostLayout from '~/components/AppInfo/GamepadPosts/GamepadPostLayout';
import { isTypeRatingMedal, validatePostGamepadId, validatePostRatingMedal, validatePostTagIds, validatePostText } from '~/lib/form-validators/posts';
import { validateSystemName } from '~/lib/form-validators/profile';

// These are all possible tags that can be used when
// creating a performance post
interface UserSelectPostTag {
  postTagId: number;
  description: string;
}

// These are all possible gamepads a user can post about
interface UserSelectGamePad {
  gamepadId: number;
  description: string;
}

interface GamepadPostsLoaderData {
  steamUserData: {
    isLoggedIn: boolean;
    ownsApp: boolean;
    postTags: UserSelectPostTag[];
    gamepads: UserSelectGamePad[];
  }
  steamAppId: SteamGamepadPost['steamAppId'];
  gamepadPosts: {
    id: SteamGamepadPost['id'];
    createdAt: SteamGamepadPost['createdAt'];
    displayName: SteamGamepadPost['displayName'];
    avatarMedium: SteamGamepadPost['avatarMedium'];
    postText: SteamGamepadPost['postText'];
    ratingMedal: SteamGamepadPost['ratingMedal'];
    postTags: {
      postTagId: PostTag['postTagId'];
      description: PostTag['description'];
    }[],
    gamepad: {
      description: SteamGamepad['description'];
    }
  }[]
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
  const gamepadPosts = await findGamepadPostsBySteamAppId(steamAppId);
  let isLoggedIn = false;
  let ownsApp = false;
  let postTags: UserSelectPostTag[] = [];
  let gamepads: UserSelectGamePad[] = [];
  if (steamUser) {
    isLoggedIn = true;
    ownsApp = await doesSteamUserOwnApp(steamUser.steamUserId, steamAppId);
    postTags = await findPostTags();
    gamepads = await findGamePads();
  }
  return json<GamepadPostsLoaderData>({
    steamUserData: {
      isLoggedIn,
      ownsApp,
      postTags,
      gamepads,
    },
    steamAppId,
    gamepadPosts,
  });
}

export type CreateGamepadPostActionData = {
  formError?: string;
  fieldErrors?: {
    postText?: string | undefined;
    ratingMedal?: string | undefined;
    postTagIds?: string | undefined;
    gamepadId?: string | undefined;
    systemName?: string | undefined;
  };
  fields?: {
    postText: SteamGamepadPost['postText'];
  };
};

const badRequest = (data: CreateGamepadPostActionData) => json(data, { status: 400 });


export async function action({ params, context, request }: ActionArgs) {
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
  const gamepadIdString = formData.get('gamepadPostGamepadId');
  const postText = formData.get('gamepadPostText');
  const ratingMedal = formData.get('gamepadPostRatingMedal[value]');
  const systemName = formData.get('gamepadPostSystemName[value]');
  const postTagIdsData = formData.getAll('gamepadPostTags');
  if (
    typeof gamepadIdString !== 'string' ||
    typeof postText !== 'string' ||
    typeof ratingMedal !== 'string' ||
    typeof systemName !== 'string' ||
    postTagIdsData.some((tagId) => typeof tagId !== 'string')
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const gamepadId = Number(gamepadIdString);
  let postTagIds: number[] = [];
  if (postTagIdsData[0] !== '') {
    postTagIds = postTagIdsData.map((tagId) => Number(tagId.toString()));
  }
  const fieldErrors = {
    gamepadId: validatePostGamepadId(gamepadId),
    postText: validatePostText(postText),
    ratingMedal: validatePostRatingMedal(ratingMedal),
    postTagIds: validatePostTagIds(postTagIds),
    systemName: validateSystemName(systemName),
  };
  const fields = {
    postText,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  // This should never return true (used for Typescript type validation)
  if (!isTypeRatingMedal(ratingMedal)) {
    return badRequest({ fieldErrors, fields });
  }

  await createGamepadPost({
    steamAppId,
    steamUserId,
    avatarMedium,
    displayName,
    postText,
    gamepadId,
    ratingMedal,
    postTagIds,
    systemName,
  });

  return redirect(`/apps/${steamAppId}/controller-posts`);
}

export default function GamepadPostsRoute() {
  const actionData = useActionData<CreateGamepadPostActionData>();
  const {
    steamUserData,
    steamAppId,
    gamepadPosts,
  } = useLoaderData<GamepadPostsLoaderData>();
  const {
    isLoggedIn,
    ownsApp,
    postTags,
    gamepads,
  } = steamUserData;
  const matches = useMatches();
  const rootLoaderData = matches[0].data as SerializedRootLoaderData;
  const { prismaData } = rootLoaderData;
  let systemNames: string[] = [];
  if (prismaData && isLoggedIn) {
    systemNames = prismaData.systemSpecs.map((systemSpec) => systemSpec.systemName);
  }

  const transition = useTransition();
  const isSubmittingGamepadPost =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_gamepadPostAction') === 'createPost';

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full">
        <GamepadPostLayout
          gamepadPosts={gamepadPosts.map((gamepadPost) => ({
            ...gamepadPost,
            createdAt: new Date(gamepadPost.createdAt),
          }))}
        />
      </div>
      <div className="w-full">
        <GamepadPostForm
          steamAppId={steamAppId}
          steamUser={{ isLoggedIn, ownsApp, systemNames }}
          formError={actionData?.formError}
          fieldErrors={actionData?.fieldErrors}
          fields={actionData?.fields}
          isSubmittingForm={isSubmittingGamepadPost}
          postTags={postTags}
          gamepads={gamepads}
        />
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <PageWrapper>
      <h1>Error in /apps/$appid/gamepad-posts route</h1>
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
