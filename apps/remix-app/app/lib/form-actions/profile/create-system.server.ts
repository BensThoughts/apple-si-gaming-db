import { redirect, json } from '@remix-run/node';
import { createSystemSpecs, findSystemSpecSystemNames } from '~/models/steamUserSystemSpecs.server';
import type { SystemSpec } from '~/interfaces';
import type { SteamUserSystemSpecs } from '@apple-si-gaming-db/database';
import type { CreateSystemSpecActionData, ProfileActionData } from '~/routes/profile';

const badRequest = (data: CreateSystemSpecActionData) => (
  json<ProfileActionData>({
    _profileAction: {
      createSystemSpec: data,
    },
  }, { status: 400 })
);

function validateSystemInfo(systemSpec: SystemSpec) {
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

function validateSystemName(systemName: string, systemNames: string[]) {
  if (systemName.length < 3) {
    return `The system name is too short (3 character minimum)`;
  }
  if (systemName.length > 100) {
    return `The system name is too long (100 character maximum)`;
  }
  if (systemNames.includes(systemName)) {
    return `The system name ${systemName} is already taken`;
  }
}

export function extractSystemSpecs(
    systemData: string,
) {
  // TODO: Need to fix modelRe (it captures CPU Model:)
  const manufacturerRe = /Manufacturer:\s*([^\r\n]+)/i;
  const modelRe = /Model:\s*([^\r\n]+)/i;
  const formFactorRe = /Form Factor:\s*([^\r\n]+)/i;
  const cpuVendorRe = /CPU Vendor:\s*([^\r\n]+)/i;
  const cpuBrandRe = /CPU Brand:\s*([^\r\n]+)/i;
  const cpuFamilyRe = /CPU Family:\s*([^\r\n]+)/i;
  const cpuModelRe = /CPU Model:\s*([^\r\n]+)/i;
  const cpuSteppingRe = /CPU Stepping:\s*([^\r\n]+)/i;
  const cpuTypeRe = /CPU Type:\s*([^\r\n]+)/i;
  const cpuSpeedRe = /Speed:\s*([^\r\n]+)/i;
  const operatingSystemVersionRe = /Operating System Version:[\r\n]+\s*([^\r\n]+)/i;

  const videoDriverRe = /Driver:\s*([^\r\n]+)/i;
  const videoDriverVersionRe = /Driver Version:\s*([^\r\n]+)/i;
  const videoPrimaryVRAMRe = /Primary VRAM:\s*([^\r\n]+)/i;
  const memoryRAMRe = /RAM:\s*([^\r\n]+)/i;


  const manufacturer = systemData.match(manufacturerRe);
  const model = systemData.match(modelRe);
  const formFactor = systemData.match(formFactorRe);
  const cpuVendor = systemData.match(cpuVendorRe);
  const cpuBrand = systemData.match(cpuBrandRe);
  const cpuFamily = systemData.match(cpuFamilyRe);
  const cpuModel = systemData.match(cpuModelRe);
  const cpuStepping = systemData.match(cpuSteppingRe);
  const cpuType = systemData.match(cpuTypeRe);
  const cpuSpeed = systemData.match(cpuSpeedRe);
  const osVersion = systemData.match(operatingSystemVersionRe);
  const videoDriver = systemData.match(videoDriverRe);
  const videoDriverVersion = systemData.match(videoDriverVersionRe);
  const videoPrimaryVRAM = systemData.match(videoPrimaryVRAMRe);
  const memoryRAM = systemData.match(memoryRAMRe);

  return {
    manufacturer: manufacturer ? manufacturer[1] : null,
    model: model ? model[1] : null,
    formFactor: formFactor ? formFactor[1] : null,
    cpuVendor: cpuVendor ? cpuVendor[1] : null,
    cpuBrand: cpuBrand ? cpuBrand[1] : null,
    cpuFamily: cpuFamily ? cpuFamily[1] : null,
    cpuModel: cpuModel ? cpuModel[1] : null,
    cpuStepping: cpuStepping ? cpuStepping[1] : null,
    cpuType: cpuType ? cpuType[1] : null,
    cpuSpeed: cpuSpeed ? cpuSpeed[1] : null,
    osVersion: osVersion ? osVersion[1] : null,
    videoDriver: videoDriver ? videoDriver[1] : null,
    videoDriverVersion: videoDriverVersion ? videoDriverVersion[1] : null,
    videoPrimaryVRAM: videoPrimaryVRAM ? videoPrimaryVRAM[1] : null,
    memoryRAM: memoryRAM ? memoryRAM[1] : null,
  };
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
  const systemNames = await findSystemSpecSystemNames(steamUserId);
  if (!systemNames) {
    return badRequest({ formError: `Could not find steam user with id ${steamUserId}` });
  }
  const fieldErrors = {
    systemName: validateSystemName(systemName, systemNames),
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
