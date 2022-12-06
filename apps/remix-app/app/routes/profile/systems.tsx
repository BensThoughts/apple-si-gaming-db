import { redirect, json } from '@remix-run/node';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { useActionData, useTransition } from '@remix-run/react';
import SystemSpecLayout from '~/components/Profile/Systems/SystemSpecLayout';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { createSystem } from '~/lib/form-actions/profile/create-system.server';
import { deleteSystem } from '~/lib/form-actions/profile/delete-system.server';
import { editSystem } from '~/lib/form-actions/profile/edit-system.server';
import { useSteamUserSystemSpecs } from '~/lib/hooks/useMatchesData';

export async function loader({ context }: LoaderArgs) {
  const { steamUser } = extractAppLoadContext(context);
  if (!steamUser) {
    return redirect('/profile');
  }
  return json({});
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

export type ProfileSystemsActionData = {
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
    default: {
      throw new Error('Unexpected action in /profile');
    }
  }
}

export default function ProfileSystemsRoute() {
  const steamUserSystemSpecs = useSteamUserSystemSpecs();
  const systemSpecs = steamUserSystemSpecs ? steamUserSystemSpecs : [];
  const actionData = useActionData<ProfileSystemsActionData>();
  const transition = useTransition();

  const isSubmittingCreateSystemForm =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_profileAction') === 'createSystem';

  return (
    <SystemSpecLayout
      systemSpecs={systemSpecs}
      isSubmittingCreateSystemForm={isSubmittingCreateSystemForm}
      createSystemSpecActionData={actionData?._profileAction.createSystemSpec}
      editSystemSpecActionData={actionData?._profileAction.editSystemSpec}
      deleteSystemSpecActionData={actionData?._profileAction.deleteSystemSpec}
    />
  );
}
