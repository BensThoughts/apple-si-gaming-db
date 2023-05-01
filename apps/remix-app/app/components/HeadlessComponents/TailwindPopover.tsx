import { Popover, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import type { BaseSvgIconProps } from '../Icons/BaseSvgIcon';
import { ChevronUpIcon } from '~/components/Icons/FeatherIcons';
import { usePopper } from 'react-popper';

export default function TailwindPopover({
  buttonText,
  Icon,
  children,
} : {
  buttonText: string;
  Icon?: ComponentType<BaseSvgIconProps>;
  children: ReactNode;
}) {
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 0],
        },
      },
    ],
  });
  return (
    <Popover as="div" className="relative inline-block text-left">
      <Popover.Button
        ref={setReferenceElement}
        type="button"
        className="flex items-center justify-center gap-2 h-[38px]
                   rounded-md bg-primary py-px px-2 text-primary hover:bg-primary-highlight
                   focus:outline-none focus-visible:show-ring"
      >
        {buttonText}
        {Icon && (
          <Icon
            className="h-6 w-6 stroke-text-primary-highlight stroke-1"
            aria-hidden="true"
          />
        )}
        <ChevronUpIcon
          className="rotate-180 w-5 h-5 text-gray-400 pr-2 border-r-1 border-r-secondary-highlight"
          aria-hidden="true"
        />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Popover.Panel
          ref={setPopperElement}
          style={styles.popper}
          className="my-2 w-full min-w-max isolate z-[100] border-1 border-secondary-highlight
                     rounded-md bg-primary shadow-lg focus:outline-none"
          {...attributes.popper}
        >
          {children}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
