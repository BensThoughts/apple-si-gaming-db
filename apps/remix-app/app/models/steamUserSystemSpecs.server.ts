import type { SteamUserSystemSpecs } from '@apple-si-gaming-db/database';
import prisma from '~/lib/database/db.server';

function extractSystemSpecs(
    systemData: string,
) {
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

export async function createSystemSpecs(
    steamUserId: SteamUserSystemSpecs['steamUserId'],
    systemName: SteamUserSystemSpecs['systemName'],
    systemData: string,
) {
  const sysSpecs = extractSystemSpecs(systemData);
  return prisma.steamUserSystemSpecs.create({
    data: {
      steamUserId,
      systemName,
      ...sysSpecs,
    },
  });
}
