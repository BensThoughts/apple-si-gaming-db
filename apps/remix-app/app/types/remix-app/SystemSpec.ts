// System Spec as copy/pasted directly from Steam system information panel
// Used on the remix server side to make parsing system
// spec data from the FormData dump easier.  Also
// used when creating a new system with prisma in createSystemSpecs()
export interface SteamSystemSpec {
  computerInformation: {
    manufacturer: string | null;
    model: string | null;
    formFactor: string | null;
  } | null,
  processorInformation: {
    cpuVendor: string | null;
    cpuBrand: string | null;
    cpuFamily: string | null;
    cpuModel: string | null;
    cpuStepping: string | null;
    cpuType: string | null;
    cpuSpeed: string | null;
  } | null,
  os: {
    osVersion: string | null;
  },
  videoCard: {
    videoDriver: string | null;
    videoDriverVersion: string | null;
    videoPrimaryVRAM: string | null;
  } | null,
  memory: {
    memoryRAM: string | null;
  }
}

export type SystemSpec = {
  systemSpecId: number; // id in database
  systemName: string;
  manufacturer: string | null;
  model: string | null;
  cpuBrand: string | null;
  osVersion: string | null;
  videoDriver: string | null;
  videoDriverVersion: string | null;
  videoPrimaryVRAM: string | null;
  memoryRAM: string | null;
}
