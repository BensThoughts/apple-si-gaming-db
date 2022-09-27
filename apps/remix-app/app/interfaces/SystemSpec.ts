export interface SystemSpec {
  manufacturer: string | null;
  model: string | null;
  formFactor: string | null;
  cpuVendor: string | null;
  cpuBrand: string | null;
  cpuFamily: string | null;
  cpuModel: string | null;
  cpuStepping: string | null;
  cpuType: string | null;
  cpuSpeed: string | null;
  osVersion: string | null;
  videoDriver: string | null;
  videoDriverVersion: string | null;
  videoPrimaryVRAM: string | null;
  memoryRAM: string | null;
}
