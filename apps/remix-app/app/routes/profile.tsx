import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  useActionData,
  useLoaderData,
  useTransition,
} from '@remix-run/react';
import AsideCard from '~/components/Cards/AsideCard';
import LoginCard from '~/components/Profile/LoginCard';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { findUserProfileData, updateUserOwnedApps, upsertSteamUser } from '~/models/steamUser.server';
import ExternalLink from '~/components/ExternalLink';
import PageWrapper from '~/components/Layout/PageWrapper';
import UserDisplay from '~/components/Profile/UserDisplay';
import { createSystem } from '~/lib/form-actions/profile/create-system.server';
import { deleteSystem } from '~/lib/form-actions/profile/delete-system.server';
import { editSystem } from '~/lib/form-actions/profile/edit-system.server';
import { metaTags } from '~/lib/meta-tags';
import type { SteamGenre } from '~/interfaces/database';
import { commitProfileSession, getProfileSession } from '~/lib/sessions/cookie-sessions.server';

interface LoaderData {
  isLoggedIn: boolean;
  steamUserId: string | null;
  displayName: string | null;
  avatarFull: string | null,
  ownedApps: {
    steamAppId: number;
    name: string;
    headerImage: string | null;
    platformMac: boolean | null;
    genres: SteamGenre[];
  }[],
  systemNames: string[],
  systemSpecs: {
    systemName: string;
    manufacturer: string | null;
    model: string | null;
    cpuBrand: string | null;
    osVersion: string | null;
    videoDriver: string | null;
    videoDriverVersion: string | null;
    videoPrimaryVRAM: string | null;
    memoryRAM: string | null;
  }[],
}

async function getUserProfileLoaderData(steamUserId: string): Promise<LoaderData> {
  const userProfile = await findUserProfileData(steamUserId);
  if (userProfile) {
    const {
      steamUserId,
      displayName,
      avatarFull,
      ownedApps,
      systemSpecs,
    } = userProfile;
    return {
      isLoggedIn: true,
      steamUserId,
      displayName,
      avatarFull,
      ownedApps,
      systemNames: systemSpecs.map((systemSpec) => systemSpec.systemName),
      systemSpecs,
    };
  } else {
    throw new Error(`Something went wrong loading your user profile data`);
  }
}

export async function loader({ request, context }: LoaderArgs) {
  const { steamUser } = extractAppLoadContext(context);
  const profileSession = await getProfileSession(
      request.headers.get('Cookie'),
  );

  // !profileSession.has('alreadyLoggedIn') represents first login
  // ! as opposed to just a page reload. This is unset in root.tsx
  // ! when a user logs out and is redirected to /
  if (steamUser && profileSession && !profileSession.has('alreadyLoggedIn')) {
    profileSession.set('alreadyLoggedIn', true);
    await upsertSteamUser(steamUser);
    await updateUserOwnedApps(steamUser.steamUserId);
    const userProfileLoaderData = await getUserProfileLoaderData(steamUser.steamUserId);
    return json<LoaderData>(userProfileLoaderData, {
      headers: {
        'Set-Cookie': await commitProfileSession(profileSession),
      },
    });
  }
  if (steamUser) {
    const userProfileLoaderData = await getUserProfileLoaderData(steamUser.steamUserId);
    return json<LoaderData>(userProfileLoaderData);
  }
  return json<LoaderData>({
    isLoggedIn: false,
    steamUserId: null,
    displayName: null,
    avatarFull: null,
    ownedApps: [],
    systemNames: [],
    systemSpecs: [],
  });
}

export type CreateSystemSpecActionData = {
  formError?: string;
  fieldErrors?: {
    systemName?: string;
    systemInfo?: string;
  };
  fields?: {
    systemName: string;
    systemInfo: string;
  }
}

export type EditSystemSpecActionData = {
  formError?: string;
  fieldErrors?: {
    systemName?: string;
    updatedSystemName?: string;
  };
  fields?: {
    systemName: string;
    updatedSystemName: string;
  }
}

export type DeleteSystemSpecActionData = {
  formError?: string;
  fieldErrors?: {
    systemName?: string;
  }
  fields?: {
    systemName: string;
  }
}

export type ProfileActionData = {
  _profileAction: {
    createSystemSpec?: CreateSystemSpecActionData;
    editSystemSpec?: EditSystemSpecActionData;
    deleteSystemSpec?: DeleteSystemSpecActionData;
  };
}

export async function action({ request, context }: ActionArgs) {
  const { steamUser } = extractAppLoadContext(context);
  // TODO: This should maybe return more info about the problem
  if (!steamUser) {
    return redirect('/profile');
  }
  const formData = await request.formData();
  const action = formData.get('_profileAction');
  switch (action) {
    case 'createSystem': {
      return createSystem(steamUser.steamUserId, formData);
    }
    case 'deleteSystem': {
      return deleteSystem(steamUser.steamUserId, formData);
    }
    case 'editSystem': {
      return editSystem(steamUser.steamUserId, formData);
    }
    case 'updateOwnedGames': {
      await updateUserOwnedApps(steamUser.steamUserId);
      return redirect('/profile');
    }
    default: {
      throw new Error('Unexpected action in /profile');
    }
  }
}

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  if (data.isLoggedIn) {
    return {
      title: data.displayName ? `${metaTags.title} - Profile - ${data.displayName}` : `Profile`,
    };
  }
  return {
    title: `${metaTags.title} - Login`,
  };
};

export default function ProfilePage() {
  const {
    isLoggedIn,
    displayName,
    avatarFull,
    ownedApps,
    systemSpecs,
  } = useLoaderData<LoaderData>();
  const actionData = useActionData<ProfileActionData>();
  const transition = useTransition();

  const isSubmittingCreateSystem =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_profileAction') === 'createSystem';

  const isSubmittingUpdateGames =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_profileAction') === 'updateOwnedGames';

  return (
    <PageWrapper title="Profile">
      <div className="flex flex-col gap-10 items-center w-full">
        <div
          className="flex flex-col md:flex-row gap-4 md:gap-6 md:justify-evenly
                     items-center p-4 md:p-6 rounded-lg border-1
                     border-secondary-highlight bg-tertiary w-full max-w-3xl"
        >
          <LoginCard
            isLoggedIn={isLoggedIn}
            displayName={displayName}
            avatarFull={avatarFull}
          />
          <div className="flex items-center justify-center w-full h-full">
            <AsideCard title="Note" iconBackground="bg-tertiary" className="max-w-md">
              Within your&nbsp;
              <ExternalLink
                href="https://steamcommunity.com/my/edit/settings"
                className="underline-offset-2"
              >
                Steam Privacy Settings
              </ExternalLink>
              , &apos;My profile&apos; and &apos;Game Details&apos;
              must be set to public to synchronize your Steam library
              with this site.
            </AsideCard>
          </div>
        </div>
        {isLoggedIn ? (
          <div className="w-full">
            <UserDisplay
              ownedApps={ownedApps}
              systemSpecs={systemSpecs}
              isSubmittingCreateSystem={isSubmittingCreateSystem}
              createSystemSpecActionData={actionData?._profileAction.createSystemSpec}
              editSystemSpecActionData={actionData?._profileAction.editSystemSpec}
              deleteSystemSpecActionData={actionData?._profileAction.deleteSystemSpec}
              isSubmittingUpdateGames={isSubmittingUpdateGames}
            />
          </div>
        ) : (
          null
        )}
      </div>
    </PageWrapper>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>Error in /profile route</h1>
      <div>{error.message}</div>
    </div>
  );
}

