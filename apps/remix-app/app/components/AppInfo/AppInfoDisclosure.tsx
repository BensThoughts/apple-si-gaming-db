import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUp } from '~/components/Icons';

export default function AppInfoDisclosure({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className={`flex w-full justify-between rounded-lg
                                      px-4 py-2 text-left text-sm
                                      font-medium focus:outline-none
                                      focus-visible:ring focus-visible:ring-secondary
                                      focus-visible:ring-opacity-70 transition-colors
                                      bg-primary hover:bg-primary-highlight`}>
            <span>{title}</span>
            <ChevronUp
              className={`${
                  open ? 'rotate-180 transform' : ''
              } h-5 w-5 text-primary`}
            />
          </Disclosure.Button>
          <Transition
            enter="transition duration-200 ease-in"
            enterFrom="transform -translate-y-1/4 scale-y-50 opacity-0"
            enterTo="transform translate-y-0 scale-y-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform translate-y-0 scale-y-100 opacity-100"
            leaveTo="transform -translate-y-1/4 scale-y-50 opacity-0"
          >
            <Disclosure.Panel className="border-primary border-solid border-x-2 border-b-2 p-3 rounded-b-md">
              {children}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
