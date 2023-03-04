import { redirect, json } from '@remix-run/node';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { useActionData, useTransition } from '@remix-run/react';
import SystemSpecLayout from '~/components/Profile/Systems/SystemSpecLayout';
import { createSystem } from '~/lib/form-actions/profile/create-system.server';
import { deleteSystem } from '~/lib/form-actions/profile/delete-system.server';
import { editSystem } from '~/lib/form-actions/profile/edit-system.server';
import { useUserProfileSystemSpecs } from '~/lib/hooks/useMatchesData';
import { getProfileSession } from '~/lib/sessions/profile-session.server';
import type { ProfileSystemsActionData } from '~/lib/form-actions/profile/interfaces';

export async function loader({ request }: LoaderArgs) {
  const profileSession = await getProfileSession(request);
  const userProfileId = profileSession.getUserProfileId();
  if (!userProfileId) {
    return redirect('/profile');
  }
  return json({ success: true });
}

export async function action({ request }: ActionArgs) {
  const profileSession = await getProfileSession(request);
  const userProfileId = profileSession.getUserProfileId();
  if (!userProfileId) {
    return redirect('/profile');
  }
  const formData = await request.formData();
  const action = formData.get('_profileAction');
  switch (action) {
    case 'createSystem': {
      return createSystem(userProfileId, formData);
    }
    case 'deleteSystem': {
      return deleteSystem(userProfileId, formData);
    }
    case 'editSystem': {
      return editSystem(userProfileId, formData);
    }
    default: {
      throw new Error('Unexpected action in /profile');
    }
  }
}

export default function ProfileSystemsRoute() {
  const userProfileSystemSpecs = useUserProfileSystemSpecs();
  const actionData = useActionData<ProfileSystemsActionData>();
  const transition = useTransition();

  const isSubmittingCreateSystemForm =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_profileAction') === 'createSystem';

  return (
    <SystemSpecLayout
      systemSpecs={userProfileSystemSpecs}
      isSubmittingCreateSystemForm={isSubmittingCreateSystemForm}
      createSystemSpecActionData={actionData?._profileAction.createSystemSpec}
      editSystemSpecActionData={actionData?._profileAction.editSystemSpec}
      deleteSystemSpecActionData={actionData?._profileAction.deleteSystemSpec}
    />
  );
}
