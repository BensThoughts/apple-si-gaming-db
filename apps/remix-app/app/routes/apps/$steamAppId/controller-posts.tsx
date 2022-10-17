import type { LoaderArgs } from '@remix-run/node';
import { useActionData, useCatch, useLoaderData, useMatches, useTransition } from '@remix-run/react';
import PageWrapper from '~/components/Layout/PageWrapper';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { findGamepadPostsBySteamAppId } from '~/models/gamepadPost.server';
import { findPostTags } from '~/models/postTag.server';
import type { PostTag, SteamGamepad, SteamGamepadPost } from '~/interfaces/database';
import { findGamePads } from '~/models/gamepad.server';
import { json } from '@remix-run/node';
import type { SerializedRootLoaderData } from '~/root';
import GamepadPostForm from '~/components/AppInfo/GamepadPosts/GamepadPostForm';
import { doesSteamUserOwnApp } from '~/models/steamUser.server';
import GamepadPostLayout from '~/components/AppInfo/GamepadPosts/GamepadPostLayout';

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
    postTags?: string | undefined;
    gamepad?: string | undefined;
    systemName?: string | undefined;
  };
  fields?: {
    postText: SteamGamepadPost['postText'];
  };
};

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
  console.log(caught);
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
