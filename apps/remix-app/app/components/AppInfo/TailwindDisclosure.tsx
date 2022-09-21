import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '~/components/Icons';
import { useMediaIsWide } from '~/lib/hooks/useMedia';

export default function TailwindDisclosure({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { isWide } = useMediaIsWide();
  return (
    <Disclosure defaultOpen={isWide}>
      {({ open }) => (
        <>
          <Disclosure.Button className={`flex w-full justify-between
                                      px-4 py-2 text-left text-sm
                                      font-medium focus:outline-none
                                      focus-visible:ring focus-visible:ring-secondary
                                      focus-visible:ring-opacity-70 transition-colors
                                      bg-primary hover:bg-primary-highlight
                                      ${open ? `rounded-t-lg border-t-secondary border-x-secondary
                                                border-x-1 border-t-1`
                                             : 'rounded-lg border-secondary border-1'}`}>
            <span>{title}</span>
            <ChevronUpIcon
              className={`${
                  open ? 'rotate-180 transform' : ''
              } h-5 w-5 text-primary`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className={`border-secondary border-x-1 border-b-1 p-3 bg-tertiary rounded-b-md`}>
            {children}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
