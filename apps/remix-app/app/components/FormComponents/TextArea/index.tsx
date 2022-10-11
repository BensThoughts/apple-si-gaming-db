type TextAreaProps = {
  labelText: string;
  fieldError?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

export default function TextArea({
  labelText,
  fieldError,
  id,
  defaultValue,
  className,
  required,
  ...rest
}: TextAreaProps) {
  return (
    <div className="w-full max-w-lg">
      <label htmlFor={id}>
        <span className="text-primary">
          {labelText}
        </span>
        {required &&
          <span className="text-color-error">
            *&nbsp;
          </span>
        }
        {fieldError &&
          <span className="text-primary">
            {`: `}
            <span className="text-color-error">
              {fieldError}
            </span>
          </span>
        }
      </label>
      <textarea
        id={id}
        defaultValue={defaultValue}
        className={`bg-primary rounded-lg p-2 w-full h-screen max-h-56 focus-visible:show-ring ${className}`}
        required={required}
        {...rest}
      />
    </div>
  );
}
