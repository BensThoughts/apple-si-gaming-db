type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export default function TextArea({
  className,
  ...rest
}: TextAreaProps) {
  return (
    <textarea
      className={`bg-primary rounded-lg p-2 w-full h-28 ${className}`}
      {...rest}
    />
  );
}
