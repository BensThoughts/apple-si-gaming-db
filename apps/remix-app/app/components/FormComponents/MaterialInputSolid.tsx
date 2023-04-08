import React from 'react';
import { classNames } from '~/lib/css/classNames';

export default function MaterialInputSolid({
  label,
  errorMessage,
  name,
  type = 'text',
}: {
  label: string;
  errorMessage?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="overflow-hidden relative w-full rounded bg-primary">
      <label
        htmlFor={`${name}-input`}
        className={classNames(
            'text-primary block w-full font-normal left-0 top-0 m-0 cursor-text',
            'pt-[18px] px-[12px] pb-0 absolute transition-all ease-linear duration-200',
            'text-[0.75rem] -translate-y-[14px] peer-placeholder-shown:text-[1.2rem]',
            'peer-placeholder-shown:translate-y-0',
            errorMessage ? 'text-error' : 'text-primary',
        )}
      >
        <span className="text-primary">{label}</span>
        {errorMessage && (
          <span role="alert" id={`${name}-error`} className="error-message">
            &nbsp;({errorMessage})
          </span>
        )}
      </label>

      <input
        type={type}
        required
        aria-describedby={errorMessage ? `${name}-error` : undefined}
        // displayError={displayError as boolean}
        className={classNames(
            'peer outline-none bg-transparent border-0 text-primary',
            'block text-[1.2rem] mt-[24px] pt-0 px-[12px] pb-[10px] w-full',
            'focus-visible:outline-none border-b-2 h-full',
            errorMessage ? 'border-b-error' : 'border-b-secondary',
        )}
      />
      <div
        className={classNames(
            `right-0 bottom-0 left-0 content-[''] block my-0 mx-auto`,
            `absolute transition-all duration-300 border-b-4`,
            `peer-focus:scale-150 w-full scale-0`,
            errorMessage ? `border-b-error` : `border-b-secondary`,
        )}
      />
    </div>
  );
};
