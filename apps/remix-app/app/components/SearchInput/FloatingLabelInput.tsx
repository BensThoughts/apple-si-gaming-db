type FloatingLabelInputProps = {
  id: string;
  name: string;
  label: string;
  placeholder?: undefined;
  inputSize?: 'medium' | 'large';
} & React.InputHTMLAttributes<HTMLInputElement>

export default function FloatingLabelInput({
  id,
  name,
  label,
  inputSize = 'large',
  ...rest
}: FloatingLabelInputProps) {
  let inputClassnames = 'no-outline px-3 py-3 peer bg-transparent';
  if (inputSize === 'medium') {
    inputClassnames = 'no-outline px-[7px] py-[7px] peer bg-opacity-0 bg-transparent';
  }
  return (
    <div className="relative max-w-[fit-content] bg-primary group rounded">
      <style>
        {`
          .no-outline {
            outline: none;
          }
        `}
      </style>
      <input
        name={name}
        id={id}
        type="text"
        className={inputClassnames}
        placeholder=' '
        {...rest}
      />

      <label
        htmlFor={id}
        className={`absolute left-[9px] top-px text-sm text-primary
                    transition-all duration-300 px-1 transform -translate-y-1/2
                    pointer-events-none peer-placeholder-shown:top-1/2
                    peer-placeholder-shown:text-xl group-focus-within:!top-px
                    group-focus-within:!text-sm group-focus-within:text-icon-secondary`}
      >
        {label}
      </label>

      {/* This fieldset+legend is used for the the border and notch transition */}
      <fieldset className={`inset-0 absolute border border-primary rounded
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
