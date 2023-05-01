import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpIcon } from '~/components/Icons/FeatherIcons';
import { classNames } from '~/lib/css/classNames';
import type { BaseSvgIconProps } from '../Icons/BaseSvgIcon';

export type SelectOption<T = string> = {
  name: string;
  value: T;
}

export default function SelectMenuWithIcon<T = string>({
  options,
  name,
  defaultValue,
  labelText,
  PrimaryIcon,
  SecondaryIcon,
  onChange,
}: {
  options: SelectOption<T>[];
  name: string;
  defaultValue: SelectOption<T>;
  labelText?: string;
  PrimaryIcon: React.ComponentType<BaseSvgIconProps>;
  SecondaryIcon?: React.ComponentType<BaseSvgIconProps>;
  onChange?(e: SelectOption<T>): void;
}) {
  function onSelectionChange(selection: SelectOption<T>) {
    if (onChange) {
      onChange(selection);
    }
  }

  return (
    <Listbox
      defaultValue={defaultValue}
      name={name}
      onChange={onSelectionChange}
    >
      <div>
        {/* {labelText &&
          <Listbox.Label className="text-primary sr-only">
            {labelText}
          </Listbox.Label>
        } */}
        {/* TODO: Should we be setting width here with w- (or in each component individually with max-w) */}
        <div className={`relative`}>
          <Listbox.Button
            className="relative p-2 text-left rounded-lg cursor-pointer
                       focus-visible:show-ring-tertiary bg-primary
                       hover:bg-primary-highlight h-[38px] flex items-center"
          >
            {({ value }: { value: SelectOption<T> }) => (
              <>
                <span className="flex gap-2 items-center pointer-events-none">
                  {/* TODO: Is it ok to have the label inside the button? */}
                  {labelText && (
                    <Listbox.Label>
                      {labelText}
                    </Listbox.Label>
                  )}
                  <PrimaryIcon />
                  {SecondaryIcon && <SecondaryIcon />}
                  {/* <AwardIcon /> */}
                  <ChevronUpIcon
                    className="rotate-180 w-5 h-5 text-gray-400 pr-2 border-r-1 border-r-secondary-highlight"
                    aria-hidden="true"
                  />
                </span>
              </>
            )}
          </Listbox.Button>
          <Transition
            as="div"
            leave="transition ease-in duration-[0ms]"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className={classNames(
                'absolute z-[100] py-1 mt-2',
                'text-base rounded-md bg-primary',
                'sm:text-sm w-fit border-1 border-secondary-highlight',
                // 'focus-within:ring-secondary focus-within:outline-none focus-within:ring-1',
            )}
          >

            <Listbox.Options
              className={classNames(
                  'max-h-60 sm:max-h-fit overflow-auto focus:outline-none',
                  // 'focus:ring-secondary focus:outline-none rounded-b-md',
              )}
              // className="overflow-auto absolute z-10 py-1 mt-1 sm:max-h-60
              //            text-base rounded-md bg-primary focus:outline-none
              //            focus:ring-1 focus:ring-secondary sm:text-sm w-fit"
            >

              {options.map((option, idx) => (
                <Listbox.Option
                  key={`${option}-${idx}`}
                  className={({ active }) => `${active ? 'text-neutral-lightest bg-secondary' : 'text-neutral-lighter'}
                      cursor-pointer select-none relative py-2 pl-10 pr-4
                  `}
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={classNames(
                            'block truncate',
                            selected
                              ? 'font-medium text-primary-highlight'
                              : 'font-normal text-primary',
                        )}
                      >
                        {option.name}
                      </span>
                      {selected ? (
                       <span
                         className="absolute inset-y-0 left-0 flex items-center pl-3
                                    text-primary-highlight"
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
