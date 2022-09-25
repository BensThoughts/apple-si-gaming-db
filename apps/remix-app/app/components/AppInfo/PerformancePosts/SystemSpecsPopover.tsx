import { Popover } from '@headlessui/react';
import { useState } from 'react';

interface SystemSpecsPopoverProps {
  systemSpecs: {
    manufacturer?: string | null;
    model?: string | null;
    osVersion?: string | null;
    cpuBrand?: string | null;
    videoDriver?: string | null;
    videoDriverVersion?: string | null;
    videoPrimaryVRAM?: string | null;
    memoryRAM?: string | null;
  }
}

export default function SystemSpecsPopover({
  systemSpecs,
}: SystemSpecsPopoverProps) {
  const [isShowing, setIsShowing] = useState(false);
  const {
    manufacturer,
    model,
    osVersion,
    cpuBrand,
    videoDriver,
    videoDriverVersion,
    videoPrimaryVRAM,
    memoryRAM,
  } = systemSpecs;
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            onMouseEnter={() => setIsShowing(true)}
            onMouseLeave={() => setIsShowing(false)}
          >
            <span className="underline underline-offset-4 hover:text-icon-secondary
                         transition-colors duration-200 text-sm">
              System
            </span>
          </Popover.Button>

          {(isShowing || open) && (
            <Popover.Panel
              className="absolute z-10 bg-primary border-secondary-highlight
                 border-1 rounded-md p-2 w-screen max-w-sm"
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
