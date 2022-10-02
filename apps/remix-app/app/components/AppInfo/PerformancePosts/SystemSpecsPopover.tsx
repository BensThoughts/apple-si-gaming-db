import { Popover } from '@headlessui/react';
import { useState } from 'react';

type SystemSpecsPopoverProps = {
  children: React.ReactNode;
  systemManufacturer?: string | null;
  systemModel?: string | null;
  systemOsVersion?: string | null;
  systemCpuBrand?: string | null;
  systemVideoDriver?: string | null;
  systemVideoDriverVersion?: string | null;
  systemVideoPrimaryVRAM?: string | null;
  systemMemoryRAM?: string | null;
} & React.HTMLAttributes<HTMLDivElement>

export default function SystemSpecsPopover({
  children,
  systemManufacturer,
  systemModel,
  systemOsVersion,
  systemCpuBrand,
  systemVideoDriver,
  systemVideoDriverVersion,
  systemVideoPrimaryVRAM,
  systemMemoryRAM,
}: SystemSpecsPopoverProps) {
  const [isShowing, setIsShowing] = useState(false);
  return (
    <Popover className={`relative`} as="div">
      {({ open }) => (
        <>
          <Popover.Button
            onMouseEnter={() => setIsShowing(true)}
            onMouseLeave={() => setIsShowing(false)}
            className="text-primary outline-none focus-visible:text-secondary-highlight"
          >
            {children}
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
                {systemManufacturer &&
                  <span>Manufacturer:&nbsp;
                    <span className="text-primary">{systemManufacturer}</span>
                  </span>
                }
                {systemModel &&
                  <span>Model:&nbsp;
                    <span className="text-primary">{systemModel}</span>
                  </span>
                }
                {systemOsVersion &&
                  <span>OS Version:&nbsp;
                    <span className="text-primary">{systemOsVersion}</span>
                  </span>
                }
                {systemCpuBrand &&
                  <span>CPU Brand:&nbsp;
                    <span className="text-primary">{systemCpuBrand}</span>
                  </span>
                }
                {systemVideoDriver&&
                  <span>Video Driver:&nbsp;
                    <span className="text-primary">{systemVideoDriver}</span>
                  </span>
                }
                {systemVideoDriverVersion &&
                  <span>Video Driver Version:&nbsp;
                    <span className="text-primary">{systemVideoDriverVersion}</span>
                  </span>
                }
                {systemVideoPrimaryVRAM &&
                  <span>Video VRAM:&nbsp;
                    <span className="text-primary">{systemVideoPrimaryVRAM}</span>
                  </span>
                }
                {systemMemoryRAM &&
                  <span>RAM:&nbsp;
                    <span className="text-primary">{systemMemoryRAM}</span>
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
