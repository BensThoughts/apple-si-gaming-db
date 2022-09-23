import { Popover } from '@headlessui/react';
import { useState } from 'react';

export default function SystemSpecsPopover() {
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
                <span>CPU: Test</span>
                <span>OS: Mac OS 14.1</span>
              </div>
            </Popover.Panel>
          )}
        </>
      )}
    </Popover>
  );
}
