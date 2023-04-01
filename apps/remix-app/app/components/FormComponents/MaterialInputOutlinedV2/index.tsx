import React from 'react';
import { classNames } from '~/lib/css/classNames';

type InputProps = {
  errorMessage?: string;
  label: string;
  componentSize?: 'large' | 'small';
} & React.InputHTMLAttributes<HTMLInputElement>


export default function MaterialInputOutlinedV2({
  id,
  placeholder,
  errorMessage,
  label,
  componentSize = 'large',
  type = 'text',
  ...rest
}: InputProps) {
  let inputSizeClassnames = 'px-3 py-3';
  if (componentSize === 'small') {
    inputSizeClassnames = 'px-[7px] py-[7px]';
  }

  return (
    <div className="flex flex-col gap-1 justify-center w-full">
      <div className="relative w-full rounded group bg-primary">
        <input
          id={id}
          type={type}
          className={classNames('w-full bg-transparent outline-none peer', inputSizeClassnames)}
          placeholder=" "
          {...rest}
        />
        <label
          htmlFor={id}
          className={classNames(
              'absolute left-[9px] -top-[1px] text-sm transition-all duration-300',
              'px-1 transform -translate-y-1/2 pointer-events-none peer-focus:!-top-[1px]',
              'peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xl',
              'peer-focus:!text-sm',
              errorMessage
                ? 'text-primary peer-focus:text-primary'
                : 'text-primary peer-focus:text-tertiary',
          )}
        >
          {label}
        </label>

        {/* This fieldset+legend is used for the the border and notch transition */}
        <fieldset
          className={classNames(
              'inset-0 absolute border rounded peer-focus:border-2',
              'pointer-events-none mt-[-9px] invisible peer-placeholder-shown:visible',
              errorMessage
                ? 'border-text-error group-hover:border-text-error peer-focus:!border-text-error'
                : 'border-secondary-highlight group-hover:border-secondary peer-focus:!border-secondary',
          )}
        >
          <legend
            className="ml-2 px-0 text-sm transition-all duration-300 invisible
                       max-w-[0.01px] group-focus-within:max-w-full group-focus-within:px-1
                       whitespace-nowrap"
          >
            {label}
          </legend>
        </fieldset>

        {/* This fieldset+legend always has a notch and is shown when the input is filled, instead of the other, so the notch doesnt vanish when you unfocus the field */}
        <fieldset
          className={classNames(
              'inset-0 absolute border rounded group-focus-within:border-2',
              'pointer-events-none mt-[-9px] visible peer-placeholder-shown:invisible',
              errorMessage ? 'border-text-error' : 'border-secondary',
          )}
        >
          <legend className="invisible px-1 ml-2 max-w-full text-sm whitespace-nowrap">
            {label}
          </legend>
        </fieldset>
      </div>
      <div
        className={classNames(
            'text-base text-error transition-all ease-in-out duration-300',
            errorMessage ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        {errorMessage}
      </div>
    </div>
  );
}
