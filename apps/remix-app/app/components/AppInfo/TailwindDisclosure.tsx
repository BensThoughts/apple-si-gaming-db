import { Disclosure } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { ChevronUpIcon } from '~/components/Icons';
import { useMediaIsWide } from '~/lib/hooks/useMedia';

export default function TailwindDisclosure({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const isWide = useMediaIsWide(false);
  const [isOpen, setIsOpen] = useState(true);

  // TODO: Maybe remove this useEffect and isWide
  // it causes potential pop (is there a way for the server
  // to know if screen is wide? or at least mobile?)
  useEffect(() => {
    setIsOpen(isWide);
  }, [isWide]);

  return (
    <Disclosure>
      <Disclosure.Button
        onClick={() => setIsOpen(!isOpen)}
        className={`peer flex w-full justify-between px-4 py-2 text-left text-sm
                        font-medium focus-visible:show-ring transition-colors
                        bg-primary hover:bg-primary-highlight
                        ${isOpen ? `rounded-t-lg border-t-secondary border-x-secondary
                                  border-x-1 border-t-1`
                               : 'rounded-lg border-secondary border-1'}`}
      >
        <span>{title}</span>
        <ChevronUpIcon
          className={`${isOpen ? 'rotate-180 transform' : 'rotate-0 transform'} h-5 w-5 text-primary`}
        />
      </Disclosure.Button>
      {isOpen &&
        <Disclosure.Panel
          static
          className={`peer-focus-visible:show-ring border-secondary border-x-1 border-b-1 p-3 bg-tertiary rounded-b-md`}
        >
          {children}
        </Disclosure.Panel>
      }
    </Disclosure>
  );
}
