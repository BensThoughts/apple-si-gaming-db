import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '~/components/Icons';

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
            <ChevronUpIcon
              className={`${
                  open ? 'rotate-180 transform' : ''
              } h-5 w-5 text-primary`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="border-primary border-solid border-x-2 border-b-2 p-3 rounded-b-md">
            {children}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
