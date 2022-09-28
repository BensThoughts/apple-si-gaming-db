import { json, redirect } from '@remix-run/node';
import type { SteamUserSystemSpecs } from '~/interfaces/database';
import { findSystemSpecSystemNames, updateSteamUserSystemSpecSystemName } from '~/models/steamUserSystemSpecs.server';
import type { EditSystemSpecActionData, ProfileActionData } from '~/routes/profile';

const badRequest = (data: EditSystemSpecActionData) => (
  json<ProfileActionData>({
    _profileAction: {
      editSystemSpec: data,
    },
  }, { status: 400 })
);
function validateSystemName(systemName: string) {
  if (systemName.length < 3) {
    return `The system name was too short (3 character minimum)`;
  }
  if (systemName.length > 100) {
    return `The system name was too long (100 character maximum)`;
  }
}

function validateUpdatedSystemName(updatedSystemName: string, systemNames: string[]) {
  if (updatedSystemName.length < 3) {
    return `The updated system name was too short (3 character minimum)`;
  }
  if (updatedSystemName.length > 100) {
    return `The updated system name was too long (100 character maximum)`;
  }
  if (systemNames.includes(updatedSystemName)) {
    return `The system name ${updatedSystemName} is already taken`;
  }
}

export async function editSystem(
    steamUserId: SteamUserSystemSpecs['steamUserId'],
    formData: FormData,
) {
  const systemName = formData.get('systemName');
  const updatedSystemName = formData.get('updatedSystemName');
  if (
    typeof systemName !== 'string' ||
    typeof updatedSystemName !== 'string'
  ) {
    return badRequest({ formError: `Edit system form not submitted correctly.` });
  }

  const systemNames = await findSystemSpecSystemNames(steamUserId);
  if (!systemNames) {
    return badRequest({ formError: `Edit system form not submitted correctly.` });
  }

  const fieldErrors = {
    systemName: validateSystemName(systemName),
    updatedSystemName: validateUpdatedSystemName(updatedSystemName, systemNames),
  };
  const fields = {
    systemName,
    updatedSystemName,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  await updateSteamUserSystemSpecSystemName(steamUserId, systemName, updatedSystemName);

  return redirect('/profile');
}
