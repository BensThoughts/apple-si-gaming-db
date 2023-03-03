import { json } from '@remix-run/node';
import type { PrismaUserSystemSpec } from '~/interfaces/database';
import {
  findSystemSpecSystemNames,
  updateSystemSpecSystemName,
} from '~/models/SteamedApples/userSystemSpecs.server';
import type { EditSystemSpecActionData, ProfileSystemsActionData } from '~/routes/profile/systems';
import { validateNewSystemName, validateSystemName, validateSystemSpecIdForProfile } from '~/lib/form-validators/profile';

const badRequest = (data: EditSystemSpecActionData) => (
  json<ProfileSystemsActionData>({
    _profileAction: {
      editSystemSpec: data,
    },
  }, { status: 400 })
);

export async function editSystem(
    userProfileId: PrismaUserSystemSpec['userProfileId'],
    formData: FormData,
) {
  const systemSpecIdString = formData.get('systemSpecId');
  const systemName = formData.get('systemName'); // TODO: Needed?
  const updatedSystemName = formData.get('updatedSystemName');
  if (
    typeof systemSpecIdString !== 'string' ||
    typeof systemName !== 'string' || // TODO: Needed?
    typeof updatedSystemName !== 'string'
  ) {
    return badRequest({ formError: `Edit system form not submitted correctly.` });
  }

  const systemSpecId = Number(systemSpecIdString);
  const systemNames = await findSystemSpecSystemNames(userProfileId);

  const fieldErrors = {
    systemSpecId: validateSystemSpecIdForProfile(systemSpecId),
    systemName: validateSystemName(systemName), // TODO: Needed?
    updatedSystemName: validateNewSystemName(updatedSystemName, systemNames),
  };
  const fields = {
    systemSpecId,
    systemName, // TODO: Needed?
    updatedSystemName,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  await updateSystemSpecSystemName(systemSpecId, updatedSystemName);

  return json<ProfileSystemsActionData>({ _profileAction: {} });
}
