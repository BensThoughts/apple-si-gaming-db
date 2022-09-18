import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpIcon } from '~/components/Icons';

export default function SelectMenu({
  options,
  onChange,
  name,
  defaultValue,
}: {
  options: string[],
  onChange?(e: string): void,
  name: string,
  defaultValue: string,
}) {
  function onSelectionChange(selection: string) {
    if (onChange) {
      onChange(selection);
    }
  }

  return (
    <Listbox
      defaultValue={defaultValue}
      onChange={onSelectionChange}
      name={name}
    >
      <div className="w-72">
        <div className="relative">
          <Listbox.Button
            className={`relative py-2 pr-10 pl-3 w-full text-left rounded-lg
                        cursor-default text-neutral-lightest bg-neutral-medium
                        focus-visible:ring-2 focus-visible:ring-secondary
                        focus-visible:ring-opacity-80 focus-visible:ring-offset-4
                        focus-visible:ring-offset-app-bg focus:outline-none sm:text-sm
                        bg-primary`}
          >
            {({ value }: { value: string }) => (
              <>
                <span className='block truncate'>
                  {value}
                </span>
                <span className="flex absolute inset-y-0 right-0 items-center pr-2 pointer-events-none">
                  <ChevronUpIcon
                    className="w-5 h-5 text-gray-400 rotate-180"
                    aria-hidden="true"
                  />
                </span>
              </>
            )}

          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="overflow-auto absolute z-10 py-1 mt-1 w-full max-h-60 text-base rounded-md bg-primary focus:outline-none focus:ring-1 focus:ring-secondary sm:text-sm"
            >
              {options.map((option, optionIdx) => (
                <Listbox.Option
                  key={`${option}-optionIdx`}
                  className={({ active }) => `${active ? 'text-neutral-lightest bg-secondary' : 'text-neutral-lighter'}
                      cursor-default select-none relative py-2 pl-10 pr-4
                  `}
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`${
                          selected ? 'font-medium' : 'font-normal'
                        } block truncate`}
                      >
                        {option}
                      </span>
                      {selected ? (
                       <span
                         className={`${
                         active ? 'text-accent' : 'text-primary'
                         }
                             absolute inset-y-0 left-0 flex items-center pl-3`}
                       >
                         <CheckIcon className="w-5 h-5" aria-hidden="true" />
                       </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </div>
    </Listbox>
  );
}
