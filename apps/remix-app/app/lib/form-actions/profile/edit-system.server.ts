import { json } from '@remix-run/node';
import type { PrismaUserSystemSpec } from '~/types/database';
import {
  findSystemSpecSystemNames,
  updateSystemSpecSystemName,
} from '~/models/SteamedApples/userSystemSpecs.server';
import type { EditSystemSpecActionData, ProfileSystemsActionData } from './interfaces';
import {
  validateNewSystemName,
  validateSystemSpecIdForProfile,
} from '~/lib/form-validators/profile';
import { EditSystemFormFields } from '~/lib/enums/FormFields/SystemSpec';

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
  const systemSpecIdString = formData.get(EditSystemFormFields.SystemSpecId);
  const updatedSystemName = formData.get(EditSystemFormFields.UpdatedSystemName);
  if (
    typeof systemSpecIdString !== 'string' ||
    typeof updatedSystemName !== 'string'
  ) {
    return badRequest({ formError: `Edit system form not submitted correctly.` });
  }

  const systemSpecId = Number(systemSpecIdString);
  const currentSystemNames = await findSystemSpecSystemNames(userProfileId);

  const fieldErrors = {
    systemSpecId: validateSystemSpecIdForProfile(systemSpecId),
    updatedSystemName: validateNewSystemName(updatedSystemName, currentSystemNames),
  };
  const fields = {
    systemSpecId,
    updatedSystemName,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  await updateSystemSpecSystemName(systemSpecId, updatedSystemName);

  return json<ProfileSystemsActionData>({ _profileAction: {} });
}
