import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '~/components/Icons';

export default function TailwindDisclosureUncontrolled({
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
                        font-medium focus-visible:show-ring transition-colors
                        bg-primary hover:bg-primary-highlight
                        ${open ? 'rounded-t-lg border-b-1 border-b-primary-highlight' : 'rounded-lg'}`}
            >
              <span>{title}</span>
              <ChevronUpIcon
                className={`${open ? 'rotate-180 transform' : 'rotate-0 transform'} h-5 w-5 text-primary`}
              />
            </Disclosure.Button>
            <Disclosure.Panel
              className={`peer-focus-visible:show-ring p-3 bg-primary rounded-b-lg`}
            >
              {children}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
