import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpIcon } from '~/components/Icons/FeatherIcons';
import { classNames } from '~/lib/css/classNames';

export type SelectOption<T = string> = {
  name: string;
  value: T;
}

export default function SelectMenu<T = string>({
  options,
  onChange,
  name,
  defaultValue,
  value,
  labelText,
  fieldError,
  required = false,
  menuSize = 'medium',
  outlineStyle = false,
  showLabel = true,
}: {
  options: SelectOption<T>[];
  onChange?(e: SelectOption<T>): void;
  name?: string;
  defaultValue?: SelectOption<T>;
  value?: SelectOption<T>;
  labelText?: string;
  fieldError?: string;
  required?: boolean;
  menuSize?: 'medium' | 'large';
  outlineStyle?: boolean;
  showLabel?: boolean;
}) {
  function onSelectionChange(selection: SelectOption<T>) {
    if (onChange) {
      onChange(selection);
    }
  }

  return (
    <Listbox
      defaultValue={defaultValue}
      value={value}
      onChange={onSelectionChange}
      name={name}
      by="value"
    >
      <div>
        {labelText &&
          <Listbox.Label>
            <span className={`text-primary ${!showLabel ? 'sr-only' : ''}`}>
              {labelText}
            </span>
            {required &&
              <span className={`text-primary ${!showLabel ? 'sr-only' : ''}`}>
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
          </Listbox.Label>
        }
        {/* TODO: Should we be setting width here with w- (or in each component individually with max-w) */}
        <div className={`relative mt-1.5 ${menuSize === 'medium' ? 'w-72' : 'w-80'}`}>
          <Listbox.Button
            className={classNames(
                'relative py-2 pr-10 pl-3 w-full text-left rounded-lg',
                'cursor-pointer focus-visible:show-ring-tertiary',
                'sm:text-sm bg-primary hover:bg-primary-highlight',
                outlineStyle ? 'border-1 border-secondary-highlight' : '',
            )}
          >
            {({ value }: { value: SelectOption<T> }) => (
              <>
                <span className="block truncate text-primary-highlight">
                  {value.name}
                </span>
                <span className="flex absolute inset-y-0 right-0 items-center pr-2 pointer-events-none">
                  <ChevronUpIcon
                    className="rotate-180 w-5 h-5 text-gray-400"
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
              className="overflow-auto absolute z-[100] py-1 mt-1 w-full max-h-60
                         sm:max-h-fit text-base rounded-md bg-primary
                         focus:outline-none focus:ring-1 focus:ring-secondary
                         sm:text-sm"
            >
              {options.map((option, optionIdx) => (
                <Listbox.Option
                  key={`${option}-${optionIdx}`}
                  className={({ active }) => `${active ? 'text-primary-highlight bg-secondary' : 'text-primary'}
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
