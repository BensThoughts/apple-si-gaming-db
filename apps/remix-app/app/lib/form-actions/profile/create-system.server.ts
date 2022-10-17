import { redirect, json } from '@remix-run/node';
import { createSystemSpecs, findSystemSpecSystemNames } from '~/models/steamUserSystemSpecs.server';
import type { SteamUserSystemSpecs } from '~/interfaces/database';
import type { CreateSystemSpecActionData, ProfileActionData } from '~/routes/profile';
import { validateNewSystemName, validateSystemInfo } from '~/lib/form-validators/profile';
import type { SystemSpec } from '~/interfaces';

const badRequest = (data: CreateSystemSpecActionData) => (
  json<ProfileActionData>({
    _profileAction: {
      createSystemSpec: data,
    },
  }, { status: 400 })
);

function extractComputerInformation(compInfo: string) {
  const manufacturerRe = /Manufacturer:\s*([^\r\n]+)/i;
  const modelRe = /Model:\s*([^\r\n]+)/i;
  const formFactorRe = /Form Factor:\s*([^\r\n]+)/i;
  const manufacturerReMatch = compInfo.match(manufacturerRe);
  const modelReMatch = compInfo.match(modelRe);
  const formFactorReMatch = compInfo.match(formFactorRe);
  return {
    manufacturer: manufacturerReMatch ? manufacturerReMatch[1] : null,
    model: modelReMatch ? modelReMatch[1] : null,
    formFactor: formFactorReMatch ? formFactorReMatch[1] : null,
  };
}

function extractProcessorInformation(procInfo: string) {
  const cpuVendorRe = /CPU Vendor:\s*([^\r\n]+)/i;
  const cpuBrandRe = /CPU Brand:\s*([^\r\n]+)/i;
  const cpuFamilyRe = /CPU Family:\s*([^\r\n]+)/i;
  const cpuModelRe = /CPU Model:\s*([^\r\n]+)/i;
  const cpuSteppingRe = /CPU Stepping:\s*([^\r\n]+)/i;
  const cpuTypeRe = /CPU Type:\s*([^\r\n]+)/i;
  const cpuSpeedRe = /Speed:\s*([^\r\n]+)/i;
  const cpuVendorReMatch = procInfo.match(cpuVendorRe);
  const cpuBrandReMatch = procInfo.match(cpuBrandRe);
  const cpuFamilyReMatch = procInfo.match(cpuFamilyRe);
  const cpuModelReMatch = procInfo.match(cpuModelRe);
  const cpuSteppingReMatch = procInfo.match(cpuSteppingRe);
  const cpuTypeReMatch = procInfo.match(cpuTypeRe);
  const cpuSpeedReMatch = procInfo.match(cpuSpeedRe);
  return {
    cpuVendor: cpuVendorReMatch ? cpuVendorReMatch[1] : null,
    cpuBrand: cpuBrandReMatch ? cpuBrandReMatch[1] : null,
    cpuFamily: cpuFamilyReMatch ? cpuFamilyReMatch[1] : null,
    cpuModel: cpuModelReMatch ? cpuModelReMatch[1] : null,
    cpuStepping: cpuSteppingReMatch ? cpuSteppingReMatch[1] : null,
    cpuType: cpuTypeReMatch ? cpuTypeReMatch[1] : null,
    cpuSpeed: cpuSpeedReMatch ? cpuSpeedReMatch[1] : null,
  };
}

function extractVideoCard(vidCardInfo: string) {
  const videoDriverRe = /Driver:\s*([^\r\n]+)/i;
  const videoDriverVersionRe = /Driver Version:\s*([^\r\n]+)/i;
  const videoPrimaryVRAMRe = /Primary VRAM:\s*([^\r\n]+)/i;
  const videoDriverReMatch = vidCardInfo.match(videoDriverRe);
  const videoDriverVersionReMatch = vidCardInfo.match(videoDriverVersionRe);
  const videoPrimaryVRAMReMatch = vidCardInfo.match(videoPrimaryVRAMRe);
  return {
    videoDriver: videoDriverReMatch ? videoDriverReMatch[1] : null,
    videoDriverVersion: videoDriverVersionReMatch ? videoDriverVersionReMatch[1] : null,
    videoPrimaryVRAM: videoPrimaryVRAMReMatch ? videoPrimaryVRAMReMatch[1] : null,
  };
}

function extractSystemSpecs(
    systemData: string,
): SystemSpec {
  // TODO: this could still get messed up if someone puts Video Card: section
  // TODO: between Computer Information: and Processor Information: section

  // Capture Computer Information: section
  const compInfoRe = /(?<=Computer Information:[\n\r])[\S\s]*(?=Processor Information:)/ism;
  const compInfoReMatch = systemData.match(compInfoRe);
  let computerInformation;
  if (!compInfoReMatch || !compInfoReMatch[0]) {
    computerInformation = null;
  } else {
    const compInfo = compInfoReMatch[0];
    computerInformation = extractComputerInformation(compInfo);
  }
  // Capture Processor Information: section
  const processorInfoRe = /(?<=Processor Information:[\n\r])[\S\s]*(?=Operating System Version:)/ism;
  const processorInfoReMatch = systemData.match(processorInfoRe);
  let processorInformation;
  if (!processorInfoReMatch || !processorInfoReMatch[0]) {
    processorInformation = null;
  } else {
    const procInfo = processorInfoReMatch[0];
    processorInformation = extractProcessorInformation(procInfo);
  }

  // Capture osVersion
  const operatingSystemVersionRe = /Operating System Version:[\r\n]+\s*([^\r\n]+)/i;
  const osVersion = systemData.match(operatingSystemVersionRe);

  // Capture Video Card section
  const videoCardRe = /(?<=Video Card:[\n\r])[\S\s]*(?=Memory:)/ism;
  const videoCardReMatch = systemData.match(videoCardRe);
  let videoCard;
  if (!videoCardReMatch || !videoCardReMatch[0]) {
    videoCard = null;
  } else {
    const vidCardInfo = videoCardReMatch[0];
    videoCard = extractVideoCard(vidCardInfo);
  }

  // Capture RAM
  // TODO: Maybe make it match after Memory: section
  const memoryRAMRe = /RAM:\s*([^\r\n]+)/i;
  const memoryRAM = systemData.match(memoryRAMRe);

  return {
    computerInformation,
    processorInformation,
    os: {
      osVersion: osVersion ? osVersion[1] : null,
    },
    videoCard,
    memory: {
      memoryRAM: memoryRAM ? memoryRAM[1] : null,
    },
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
    return badRequest({ formError: `Could not find system names. Does user exist? steamUserId: ${steamUserId}` });
  }
  const fieldErrors = {
    systemName: validateNewSystemName(systemName, systemNames),
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
