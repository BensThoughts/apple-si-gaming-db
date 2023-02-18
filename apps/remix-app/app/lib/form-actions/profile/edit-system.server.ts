import { json, redirect } from '@remix-run/node';
import type { PrismaSteamUserSystemSpecs } from '~/interfaces/database';
import { findSystemSpecSystemNames, updateSteamUserSystemSpecSystemName } from '~/models/steamUserSystemSpecs.server';
import type { EditSystemSpecActionData, ProfileSystemsActionData } from '~/routes/profile/systems';
import { validateNewSystemName, validateSystemName } from '~/lib/form-validators/profile';

const badRequest = (data: EditSystemSpecActionData) => (
  json<ProfileSystemsActionData>({
    _profileAction: {
      editSystemSpec: data,
    },
  }, { status: 400 })
);

export async function editSystem(
    steamUserId: PrismaSteamUserSystemSpecs['steamUserId'],
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
    updatedSystemName: validateNewSystemName(updatedSystemName, systemNames),
  };
  const fields = {
    systemName,
    updatedSystemName,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  await updateSteamUserSystemSpecSystemName(steamUserId, systemName, updatedSystemName);

  return redirect('/profile/systems');
}
