import { Popover } from '@headlessui/react';
import { useState } from 'react';

interface SystemSpecsPopoverProps {
  osVersion?: string | null;
  cpuModel?: string | null;
  memoryRAM?: string | null;
}

export default function SystemSpecsPopover({
  osVersion,
  cpuModel,
  memoryRAM,
}: SystemSpecsPopoverProps) {
  const [isShowing, setIsShowing] = useState(false);
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
                {osVersion &&
                  <span>OS Version:&nbsp;
                    <span className="text-primary">{osVersion}</span>
                  </span>
                }
                {memoryRAM &&
                  <span>RAM:&nbsp;
                    <span className="text-primary">{memoryRAM}</span>
                  </span>
                }
                {cpuModel &&
                  <span>CPU Model:&nbsp;
                    <span className="text-primary">{cpuModel}</span>
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
