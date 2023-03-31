import {
  Disclosure,
  Transition,
} from '@headlessui/react';
import { ChevronUpIcon } from '~/components/Icons';

export default function TailwindDisclosure({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-lg">
      <Disclosure defaultOpen={defaultOpen}>
        {({ open, close }) => (
          <>
            <Disclosure.Button
              className={`peer flex w-full justify-between px-4 py-2 text-left text-sm
                        font-medium focus-visible:show-ring transition-all duration-300
                        bg-primary hover:bg-primary-highlight border-b-1
                        ${open ? 'rounded-t-lg border-b-primary-highlight' : 'rounded-lg border-b-transparent'}`}
            >
              <span>{title}</span>
              <ChevronUpIcon
                className={`${open ? 'rotate-180 transform' : 'rotate-0 transform'} h-5 w-5 text-primary`}
              />
            </Disclosure.Button>
            <Transition
              as="div"
              show={open}
              enter="transition-all duration-300 ease-in-out"
              enterFrom="transform max-h-0 opacity-0"
              enterTo="transform max-h-[60rem] opacity-100"
              leave="transition-all duration-200 ease-in-out"
              leaveFrom="transform max-h-[60rem] opacity-100"
              leaveTo="transform max-h-0 opacity-0"
              className="peer-focus-visible:show-ring rounded-b-lg"
            >
              <Disclosure.Panel>
                {children}
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
}