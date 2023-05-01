import { RadioGroup } from '@headlessui/react';
import { classNames } from '~/lib/css/classNames';

// type ArrayElement<ArrayType extends readonly unknown[]> =
//   ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type RadioGroupOption<T = string> = {
  name: string;
  value: T;
}

export default function TailwindRadioGroup<T = string>({
  name,
  options,
  defaultValue,
  labelText,
  onChange,
}: {
  name: string;
  options: RadioGroupOption<T>[];
  defaultValue?: RadioGroupOption<T>;
  labelText: string;
  onChange?(e: RadioGroupOption<T>): void;
}) {
  function onSelectionChange(selection: RadioGroupOption<T>) {
    if (onChange) {
      onChange(selection);
    }
  }
  return (
    <RadioGroup
      name={name}
      by="value"
      defaultValue={defaultValue}
      onChange={onSelectionChange}
      as="div"
      className="flex flex-col gap-2 w-full max-w-[26rem]"
    >
      <RadioGroup.Label
        as="label"
        className="sr-only"
      >
        {labelText}
      </RadioGroup.Label>
      <div className="w-full flex flex-wrap gap-2">
        {options.map((option, idx) => (
          <RadioGroup.Option
            key={`${option}-${idx}`}
            value={option}
            as="button"
            type="button"
            className={({ active, checked }) =>
              classNames(
                  'relative flex cursor-pointer px-3 py-2 shadow-md focus:outline-none',
                  'rounded-md',
                  active
                  ? 'ring-2 ring-secondary ring-opacity-60 ring-offset-2 ring-offset-secondary-highlight'
                  : '',
                  checked ? 'bg-tertiary-highlight text-primary' : 'bg-tertiary',
              )}
          >
            {({ active, checked }) => (
              <>
                <div className="flex items-center">
                  <div className="text-sm">
                    <RadioGroup.Label
                      as="p"
                      className={classNames(
                          'select-none',
                          checked ? 'text-primary-highlight' : 'text-primary',
                      )}
                    >
                      {option.name}
                    </RadioGroup.Label>
                  </div>
                </div>
                {/* {checked && (
                  <div className="shrink-0 text-white">
                    <CircleDotIcon className="h-6 w-6" />
                  </div>
                )} */}
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
