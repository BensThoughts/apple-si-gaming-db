import { redirect, json } from '@remix-run/node';
import { createSystemSpecs, extractSystemSpecs } from '~/models/steamUserSystemSpecs.server';
import type { SystemSpecData } from '~/models/steamUserSystemSpecs.server';
import type { SteamUserSystemSpecs } from '@apple-si-gaming-db/database';
import type { ProfileActionData } from '~/routes/profile';

const badRequest = (data: ProfileActionData) => json(data, { status: 400 });

function validateSystemInfo(systemSpec: SystemSpecData) {
  if (!systemSpec.manufacturer) {
    return `Cannot validate manufacturer property`;
  }
  if (!systemSpec.model) {
    return `Cannot validate model property`;
  }
  if (!systemSpec.formFactor) {
    return `Cannot validate form factor property`;
  }
  if (!systemSpec.cpuVendor) {
    return `Cannot validate cpu vendor property`;
  }
  if (!systemSpec.cpuBrand) {
    return `Cannot validate cpu brand property`;
  }
  if (!systemSpec.cpuFamily) {
    return `Cannot validate cpu family property`;
  }
  if (!systemSpec.cpuModel) {
    return `Cannot validate cpu model property`;
  }
  if (!systemSpec.cpuStepping) {
    return `Cannot validate cpu stepping property`;
  }
  if (!systemSpec.cpuType) {
    return `Cannot validate cpu type property`;
  }
  if (!systemSpec.cpuSpeed) {
    return `Cannot validate cpu speed property`;
  }
  if (!systemSpec.osVersion) {
    return `Cannot validate os version property`;
  }
  if (!systemSpec.videoDriver) {
    return `Cannot validate video driver property`;
  }
  if (!systemSpec.videoDriverVersion) {
    return `Cannot validate video driver version property`;
  }
  if (!systemSpec.videoPrimaryVRAM) {
    return `Cannot validate video primary VRAM property`;
  }
  if (!systemSpec.memoryRAM) {
    return `Cannot validate RAM property`;
  }
}

function validateSystemName(systemInfoName: string) {
  if (systemInfoName.length < 3) {
    return `The system name is too short (3 character minimum)`;
  }
  if (systemInfoName.length > 100) {
    return `The system name is too long (100 character maximum)`;
  }
}

export async function createSystem(
    steamUserId: SteamUserSystemSpecs['steamUserId'],
    formData: FormData,
) {
  const systemName = formData.get('systemName');
  const systemInfo = formData.get('systemInfo');
  if (
    typeof systemName !== 'string' ||
    typeof systemInfo !== 'string'
  ) {
    return badRequest({ formError: `Form not submitted correctly.` });
  }
  const systemSpecs = extractSystemSpecs(systemInfo);
  const fieldErrors = {
    systemName: validateSystemName(systemName),
    systemInfo: validateSystemInfo(systemSpecs),
  };
  const fields = {
    systemName,
    systemInfo,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  await createSystemSpecs(steamUserId, systemName, systemSpecs);

  return redirect(`/profile`);
}
