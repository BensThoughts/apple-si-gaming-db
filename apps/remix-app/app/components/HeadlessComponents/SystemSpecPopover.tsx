import { Popover } from '@headlessui/react';
import { useState } from 'react';
import type { SystemSpec } from '~/interfaces';
import { classNames } from '~/lib/css/classNames';
import { HardDriveIcon } from '../Icons';

type SystemSpecsPopoverProps = {
  systemSpec: {
    manufacturer: SystemSpec['manufacturer'];
    model: SystemSpec['model'];
    osVersion: SystemSpec['osVersion'];
    cpuBrand: SystemSpec['cpuBrand'];
    videoDriver: SystemSpec['videoDriver'];
    videoDriverVersion: SystemSpec['videoDriverVersion'];
    videoPrimaryVRAM: SystemSpec['videoPrimaryVRAM'];
    memoryRAM: SystemSpec['memoryRAM'];
  };
  children?: React.ReactNode;
  giveButtonStyles?: boolean;
}

export default function SystemSpecsPopover({
  systemSpec,
  children,
  giveButtonStyles = false,
}: SystemSpecsPopoverProps) {
  const [isShowing, setIsShowing] = useState(false);
  if (!Object.values(systemSpec).some(Boolean)) {
    return null;
  }
  const {
    manufacturer,
    model,
    osVersion,
    cpuBrand,
    videoDriver,
    videoDriverVersion,
    videoPrimaryVRAM,
    memoryRAM,
  } = systemSpec;
  return (
    <Popover className="relative" as="div">
      {({ open }) => (
        <>
          <Popover.Button
            onMouseEnter={() => setIsShowing(true)}
            onMouseLeave={() => setIsShowing(false)}
            className={classNames(
                'text-primary select-none outline-none',
                'focus-visible:show-ring-tertiary rounded-sm',
                giveButtonStyles
                  ? classNames(
                      'bg-primary hover:bg-primary-highlight rounded-full',
                      'flex gap-1.5 items-center border-secondary-highlight',
                      'border-1 py-1 px-3 h-[38px] group',
                  )
                  : '',
            )}
            aria-label="show system hardware"
          >
            {giveButtonStyles ? (
              <>
                <HardDriveIcon
                  className="stroke-text-primary group-hover:stroke-text-primary-highlight
                             stroke-1"
                />
                <span className="text-primary group-hover:text-primary-highlight text-sm font-light">
              System
                </span>
              </>
            ) : (
              <>
                {children}
              </>
            )}
          </Popover.Button>

          {(isShowing || open) && (
            <Popover.Panel
              className="absolute z-[100] bg-primary border-secondary-highlight
                 border-1 rounded-md p-2 w-screen max-w-[18rem] md:max-w-xs"
              onMouseEnter={() => setIsShowing(true)}
              onMouseLeave={() => setIsShowing(false)}
              static
            >
              <div className="flex flex-col gap-1 text-sm text-primary-faded">
                {manufacturer &&
                  <span>Manufacturer:&nbsp;
                    <span className="text-primary">{manufacturer}</span>
                  </span>
                }
                {model &&
                  <span>Model:&nbsp;
                    <span className="text-primary">{model}</span>
                  </span>
                }
                {osVersion &&
                  <span>OS Version:&nbsp;
                    <span className="text-primary">{osVersion}</span>
                  </span>
                }
                {cpuBrand &&
                  <span>CPU Brand:&nbsp;
                    <span className="text-primary">{cpuBrand}</span>
                  </span>
                }
                {videoDriver&&
                  <span>Video Driver:&nbsp;
                    <span className="text-primary">{videoDriver}</span>
                  </span>
                }
                {videoDriverVersion &&
                  <span>Video Driver Version:&nbsp;
                    <span className="text-primary">{videoDriverVersion}</span>
                  </span>
                }
                {videoPrimaryVRAM &&
                  <span>Video VRAM:&nbsp;
                    <span className="text-primary">{videoPrimaryVRAM}</span>
                  </span>
                }
                {memoryRAM &&
                  <span>RAM:&nbsp;
                    <span className="text-primary">{memoryRAM}</span>
                  </span>
                }
              </div>
            </Popover.Panel>
          )}
        </>
      )}
    </Popover>
  );
}