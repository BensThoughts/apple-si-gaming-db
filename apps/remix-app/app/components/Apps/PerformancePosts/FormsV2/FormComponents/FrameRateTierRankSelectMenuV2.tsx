import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpIcon, MonitorIcon } from '~/components/Icons/FeatherIcons';
import { classNames } from '~/lib/css/classNames';
import type { FeatherIconProps } from '~/components/Icons/FeatherIcons/FeatherIcon';
import type { FrameRateTierRank } from '~/types';

export type FrameRateSelectOption = {
  name: string;
  value: FrameRateTierRank;
}

export default function FrameRateTierRankSelectMenuV2({
  options,
  name,
  defaultValue,
  onChange,
}: {
  options: FrameRateSelectOption[];
  name: string;
  defaultValue: FrameRateSelectOption;
  onChange?(e: FrameRateSelectOption): void;
}) {
  function onSelectionChange(selection: FrameRateSelectOption) {
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
        {/* TODO: Should we be setting width here with w- (or in each component individually with max-w) */}
        <div className={`relative mt-1.5`}>
          <Listbox.Button
            className="relative p-2 text-left rounded-lg
                        cursor-default text-neutral-lightest bg-neutral-medium
                        focus-visible:show-ring-tertiary sm:text-sm bg-primary"
          >
            {({ value }: { value: FrameRateSelectOption }) => (
              <>
                <span className="flex gap-2 items-center pointer-events-none">
                  <MonitorIcon />
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
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="overflow-auto absolute z-10 py-1 mt-1 max-h-60
                         text-base rounded-md bg-primary focus:outline-none
                         focus:ring-1 focus:ring-secondary sm:text-sm w-fit"
            >
              {options.map((option, optionIdx) => (
                <Listbox.Option
                  key={`${option}-${optionIdx}`}
                  className={({ active }) => `${active ? 'text-neutral-lightest bg-secondary' : 'text-neutral-lighter'}
                      cursor-default select-none relative py-2 pl-10 pr-4
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