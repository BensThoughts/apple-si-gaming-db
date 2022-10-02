export interface SystemSpec {
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
