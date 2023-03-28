import { Combobox, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { CheckIcon, ChevronUpIcon } from '~/components/Icons';

export type ComboboxOption<T extends React.Key = string> = {
  label: string;
  value: T;
}

export default function ComboboxAutocomplete<T extends React.Key = string>({
  options,
  // onChange,
  name,
  defaultValue,
  labelText,
  fieldError,
  required,
}: {
  options: ComboboxOption<T>[];
  // onChange?(e: ComboboxOption<T>): void;
  name: string;
  defaultValue: ComboboxOption<T>;
  labelText?: string;
  fieldError?: string;
  required?: boolean;
}) {
  const [isOpenFromFocus, setIsOpenFromFocus] = useState(false);
  const [query, setQuery] = useState('');
  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
        option.label
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, '')),
      );

  function onChange(e: ComboboxOption<T>) {
    setIsOpenFromFocus(false);
  }

  return (
    <Combobox
      name={name}
      defaultValue={defaultValue}
      onChange={onChange}
      by="value"
    >
      {({ open }) => (
        <>
          {labelText &&
            <Combobox.Label>
              <span className="text-primary">
                {labelText}
              </span>
              {required &&
                <span className="text-error">
                  *
                </span>
              }
              {fieldError &&
                <span className="text-primary">
                  {`: `}
                  <span className="text-error">
                    {fieldError}
                  </span>
                </span>
              }
            </Combobox.Label>
          }
          <div className="relative mt-1 rounded-lg">
            <div
              className="relative w-full cursor-default overflow-hidden
                     rounded-lg bg-primary text-left shadow-md"
            >
              <Combobox.Input
                className="bg-primary w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-primary"
                displayValue={(option: ComboboxOption<T>) => option.label}
                onChange={(event) => setQuery(event.target.value)}
                // onFocus={() => setIsOpenFromFocus(true)}
                onMouseDown={() => setIsOpenFromFocus(true)}
                onBlur={() => setIsOpenFromFocus(false)}
              />
              <Combobox.Button
                className="absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <ChevronUpIcon className="rotate-180" />
              </Combobox.Button>
            </div>
            {/* {((open || isOpenFromFocus) && ( */}
            <Transition
              as={Fragment}
              enter="transition ease-out duration-150"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition ease-in duration-75"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery('')}
              show={open || isOpenFromFocus}
              static
            >
              <Combobox.Options
                className="absolute mt-1 max-h-60 w-full overflow-auto
                             rounded-md bg-primary py-1 text-base shadow-lg
                             ring-black ring-opacity-5 focus:outline-none
                             sm:text-sm border-1 border-secondary-highlight"
                static
              >
                {filteredOptions.length === 0 && query !== '' ? (
                    <div
                      className="relative cursor-default select-none py-2 px-4 text-primary-faded"
                    >
                      Nothing Found
                    </div>
                  ) : (
                    filteredOptions.map((option) => (
                      <Combobox.Option
                        key={option.value}
                        value={option}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-secondary' : 'bg-primary'
                          }`
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {option.label}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? 'text-primary-highlight' : 'text-primary'
                                }`}
                              >
                                <CheckIcon className="w-5 h-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
              </Combobox.Options>
            </Transition>
            {/* }))} */}
          </div>
        </>
      )}
    </Combobox>
  );
}
