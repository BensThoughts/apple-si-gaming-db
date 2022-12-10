type InputProps = {
  fieldError?: string;
  label: string;
  componentSize?: 'large' | 'small';
} & React.InputHTMLAttributes<HTMLInputElement>

export default function MaterialInput({
  id,
  name,
  defaultValue = '',
  minLength,
  maxLength,
  required,
  fieldError,
  label,
  componentSize = 'large',
  ...rest
}: InputProps) {
  let inputSizeClassnames = 'px-3 py-3';
  if (componentSize === 'small') {
    inputSizeClassnames = 'px-[7px] py-[7px]';
  }
  return (
    <div className={`relative group rounded bg-primary w-full`}>
      <input
        name={name}
        id={id}
        type="text"
        className={`outline-none peer bg-transparent w-full ${inputSizeClassnames}`}
        placeholder=" "
        defaultValue={defaultValue}
        minLength={minLength}
        maxLength={maxLength}
        required={required}
        {...rest}
      />

      <label
        htmlFor={id}
        className={`absolute left-[9px] -top-[1px] text-sm ${fieldError ? 'text-color-error' : 'text-primary'}
                    transition-all duration-300 px-1 transform -translate-y-1/2
                    pointer-events-none peer-placeholder-shown:top-1/2
                    peer-placeholder-shown:text-xl group-focus-within:!-top-[1px]
                    group-focus-within:!text-sm group-focus-within:text-icon-secondary`}
      >
        {label}
      </label>

      {/* This fieldset+legend is used for the the border and notch transition */}
      <fieldset className={`inset-0 absolute border border-secondary-highlight rounded
                            pointer-events-none mt-[-9px] invisible peer-placeholder-shown:visible
                            group-focus-within:!border-secondary group-focus-within:border-2
                            group-hover:border-secondary`}>
        <legend className={`ml-2 px-0 text-sm transition-all duration-300 invisible
                            max-w-[0.01px] group-focus-within:max-w-full group-focus-within:px-1
                            whitespace-nowrap`}>
          {label}
        </legend>
      </fieldset>

      {/* This fieldset+legend always has a notch and is shown when the input is filled, instead of the other, so the notch doesnt vanish when you unfocus the field */}
      <fieldset className={`inset-0 absolute border border-secondary rounded
                        pointer-events-none mt-[-9px] visible peer-placeholder-shown:invisible
                        group-focus-within:border-2`}>
        <legend className="ml-2 text-sm invisible px-1 max-w-full whitespace-nowrap">
          {label}
        </legend>
      </fieldset>

    </div>
  );
}
