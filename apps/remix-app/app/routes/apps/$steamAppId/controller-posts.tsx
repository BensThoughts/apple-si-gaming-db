import type { LoaderArgs } from '@remix-run/node';
import { useActionData, useCatch, useLoaderData, useMatches, useTransition } from '@remix-run/react';
import PageWrapper from '~/components/Layout/PageWrapper';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { findGamepadPostsBySteamAppId } from '~/models/gamepadPost.server';
import { findPostTags } from '~/models/postTag.server';
import type { PostTag, SteamGamepadPost } from '~/interfaces/database';
import { findGamePads } from '~/models/gamepad.server';
import { json } from '@remix-run/node';
import type { SerializedRootLoaderData } from '~/root';
import GamepadPostForm from '~/components/AppInfo/GampadPosts/GamepadPostForm';

// These are all possible tags that can be used when
// creating a performance post
interface UserSelectPostTag {
  postTagId: number;
  description: string;
}

// These are all possible gamepads a user can post about
interface UserSelectGamePad {
  gamepadId: number;
  label: string;
}

interface GamepadPostsLoaderData {
  steamUserData: {
    isLoggedIn: boolean;
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
    gamepadManufacturer: SteamGamepadPost['gamepadManufacturer'];
    gamepadModel: SteamGamepadPost['gamepadModel'];
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
  let postTags: UserSelectPostTag[] = [];
  let gamepads: UserSelectGamePad[] = [];
  if (steamUser) {
    isLoggedIn = true;
    postTags = await findPostTags();
    gamepads = await findGamePads();
  }
  return json<GamepadPostsLoaderData>({
    steamUserData: {
      isLoggedIn,
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
    postTags,
    gamepads,
  } = steamUserData;
  const matches = useMatches();
  const rootLoaderData = matches[0].data as SerializedRootLoaderData;
  const { prismaData } = rootLoaderData;
  let ownsApp = false;
  let systemNames: string[] = [];
  if (prismaData && isLoggedIn) {
    systemNames = prismaData.systemSpecs.map((systemSpec) => systemSpec.systemName);
    const { ownedApps } = prismaData;
    // TODO: This could be slow to run client side on large libraries
    // TODO: consider moving back to loader
    ownsApp = ownedApps.some((ownedApp) => ownedApp.steamAppId === steamAppId);
  }

  const transition = useTransition();
  const isSubmittingPerformancePost =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_performancePostAction') === 'createPost';

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full">

      </div>
      <div className="w-full">
        <GamepadPostForm
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
