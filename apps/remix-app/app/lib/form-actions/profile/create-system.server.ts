import {
  // redirect,
  json,
} from '@remix-run/node';
import { createSystemSpec, findSystemSpecSystemNames } from '~/models/SteamedApples/userSystemSpecs.server';
import type { PrismaUserSystemSpec } from '~/types/database';
import type { CreateSystemSpecActionData, ProfileSystemsActionData } from './interfaces';
import { validateNewSystemName, validateSystemInfo, extractSystemSpecs } from '~/lib/form-validators/profile';
import { CreateSystemFormFields } from '~/lib/enums/FormFields/SystemSpec';

const badRequest = (data: CreateSystemSpecActionData) => (
  json<ProfileSystemsActionData>({
    _profileAction: {
      createSystemSpec: data,
    },
  }, { status: 400 })
);

export async function createSystem(
    userProfileId: PrismaUserSystemSpec['userProfileId'],
    formData: FormData,
) {
  const systemName = formData.get(CreateSystemFormFields.SystemName);
  const systemInfo = formData.get(CreateSystemFormFields.SystemInfo);
  if (
    typeof systemName !== 'string' ||
    typeof systemInfo !== 'string'
  ) {
    return badRequest({ formError: `Form not submitted correctly.` });
  }
  const systemNames = await findSystemSpecSystemNames(userProfileId);
  // if (!systemNames) {
  //   return badRequest({ formError: `Could not find system names. Does user exist? userProfileId: ${userProfileId}` });
  // }
  const fieldErrors = {
    systemName: validateNewSystemName(systemName, systemNames),
    systemInfo: validateSystemInfo(systemInfo),
  };
  const fields = {
    systemName,
    systemInfo,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const systemSpecs = extractSystemSpecs(systemInfo);
  await createSystemSpec(userProfileId, systemName.trim(), systemSpecs);

  return json(null);
  // return redirect(`/profile/systems`);
}
