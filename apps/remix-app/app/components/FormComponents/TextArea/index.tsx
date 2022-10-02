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
  ...rest
}: TextAreaProps) {
  return (
    <div className="w-full max-w-lg">
      <label htmlFor={id}>
        {labelText}:{fieldError && <span className="text-color-error">&nbsp;{fieldError}</span>}
      </label>
      <textarea
        id={id}
        defaultValue={defaultValue}
        className={`bg-primary rounded-lg p-2 w-full h-screen max-h-56 focus-visible:show-ring ${className}`}
        {...rest}
      />
    </div>
  );
}
