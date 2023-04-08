import {
  Disclosure,
  Transition,
} from '@headlessui/react';
import { ChevronUpIcon } from '~/components/Icons';
import { classNames } from '~/lib/css/classNames';

export default function TailwindDisclosure({
  title,
  defaultOpen,
  children,
  roundedButton = true,
}: {
  title: string;
  defaultOpen: boolean;
  children: React.ReactNode;
  roundedButton?: boolean;
}) {
  return (
    <div className="w-full">
      <Disclosure defaultOpen={defaultOpen}>
        {({ open, close }) => (
          <>
            <Disclosure.Button
              className={({ open }) => classNames(
                  'peer flex w-full justify-between px-4 py-2 text-left text-sm',
                  'font-medium focus-visible:show-ring transition-all duration-300',
                  'bg-primary hover:bg-primary-highlight border-b-1',
                  open
                    ? roundedButton
                      ? 'rounded-t-lg border-b-primary-highlight'
                      : 'border-b-primary-highlight'
                    : roundedButton
                      ? 'rounded-lg border-b-transparent'
                      : 'border-b-transparent',
              )}
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
