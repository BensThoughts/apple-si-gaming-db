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
import { findUserProfileData } from '~/models/steamUser.server';
import ExternalLink from '~/components/ExternalLink';
import PageWrapper from '~/components/Layout/PageWrapper';
import UserDisplay from '~/components/Profile/UserDisplay';
import { createSystem } from '~/lib/form-actions/profile/create-system.server';
import { deleteSystem } from '~/lib/form-actions/profile/delete-system.server';
import { editSystem } from '~/lib/form-actions/profile/edit-system.server';
import { updateOwnedGames } from '~/lib/form-actions/profile/update-owned-games.server';
import { metaTags } from '~/lib/meta-tags';
import type { SteamGenre } from '~/interfaces/database';

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

export async function loader({ request, context }: LoaderArgs) {
  const { steamUser } = extractAppLoadContext(context);
  if (steamUser) {
    const userProfile = await findUserProfileData(steamUser.steamUserId);
    if (userProfile) {
      const {
        steamUserId,
        displayName,
        avatarFull,
        ownedApps,
        systemSpecs,
      } = userProfile;
      return json<LoaderData>({
        isLoggedIn: true,
        steamUserId,
        displayName,
        avatarFull,
        ownedApps,
        systemNames: systemSpecs.map((systemSpec) => systemSpec.systemName),
        systemSpecs,
      });
    } else {
      return json<LoaderData>({
        isLoggedIn: true,
        steamUserId: null,
        displayName: null,
        avatarFull: null,
        ownedApps: [],
        systemNames: [],
        systemSpecs: [],
      });
    }
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
      return updateOwnedGames(steamUser.steamUserId);
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
          className="flex flex-col md:flex-row gap-8 justify-evenly
                     border-1 border-secondary-highlight p-4 rounded-lg
                     bg-tertiary w-full max-w-3xl"
        >
          <LoginCard
            isLoggedIn={isLoggedIn}
            displayName={displayName}
            avatarFull={avatarFull}
          />
          <div className="max-w-md">
            <AsideCard title="Note" iconBackground="bg-tertiary">
              Within your&nbsp;
              <ExternalLink
                href="https://steamcommunity.com/my/edit/settings"
                className="underline-offset-2"
              >
                Steam Privacy Settings
              </ExternalLink>
              , &apos;My profile&apos; must be set to public. &apos;Game Details&apos;
              is also required to be public, so that ownership can be verified for your contributions.
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
