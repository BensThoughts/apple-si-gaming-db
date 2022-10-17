import type { SystemSpec } from '~/interfaces';

export function validateSystemName(systemName: string) {
  if (systemName.length < 3) {
    return `The system name was too short (3 character minimum)`;
  }
  if (systemName.length > 25) {
    return `The system name was too long (25 character maximum)`;
  }
}

export function validateNewSystemName(systemName: string, systemNames: string[]) {
  validateSystemName(systemName);
  if (systemNames.includes(systemName)) {
    return `The system name ${systemName} is already taken`;
  }
  // ! Added to allow for no system specs on a post
  if (systemName === 'None') {
    return `None is a reserved name and cannot be used`;
  }
}

export function validateSystemInfo(systemSpec: SystemSpec) {
  if (!systemSpec.computerInformation) {
    return `Could not find Computer Information: section, was it the first section, followed by Processor Information: section`;
  }
  if (!systemSpec.computerInformation.manufacturer) {
    return `Cannot validate manufacturer property`;
  }
  if (!systemSpec.computerInformation.model) {
    return `Cannot validate computer model property`;
  }
  if (!systemSpec.computerInformation.formFactor) {
    return `Cannot validate form factor property`;
  }
  if (!systemSpec.processorInformation) {
    return `Could not find Processor Information: section, it must be right before Operating System Version: section`;
  }
  if (!systemSpec.processorInformation.cpuVendor) {
    return `Cannot validate cpu vendor property`;
  }
  if (!systemSpec.processorInformation.cpuBrand) {
    return `Cannot validate cpu brand property`;
  }
  if (!systemSpec.processorInformation.cpuFamily) {
    return `Cannot validate cpu family property`;
  }
  if (!systemSpec.processorInformation.cpuModel) {
    return `Cannot validate cpu model property`;
  }
  if (!systemSpec.processorInformation.cpuStepping) {
    return `Cannot validate cpu stepping property`;
  }
  if (!systemSpec.processorInformation.cpuType) {
    return `Cannot validate cpu type property`;
  }
  if (!systemSpec.processorInformation.cpuSpeed) {
    return `Cannot validate cpu speed property`;
  }
  if (!systemSpec.os.osVersion) {
    return `Cannot validate os version property`;
  }
  if (!systemSpec.videoCard) {
    return `Could not find Video Card: section, it must be right before Memory: section`;
  }
  if (!systemSpec.videoCard.videoDriver) {
    return `Cannot validate video driver property`;
  }
  if (!systemSpec.videoCard.videoDriverVersion) {
    return `Cannot validate video driver version property`;
  }
  if (!systemSpec.videoCard.videoPrimaryVRAM) {
    return `Cannot validate video primary VRAM property`;
  }
  if (!systemSpec.memory.memoryRAM) {
    return `Cannot validate RAM property`;
  }
}
