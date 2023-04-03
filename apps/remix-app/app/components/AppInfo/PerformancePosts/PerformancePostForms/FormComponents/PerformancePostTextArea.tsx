import TextArea from '~/components/FormComponents/TextArea';

export default function PerformancePostTextArea({
  name,
  defaultValue,
  fieldError,
}: {
  name: string;
  defaultValue?: string;
  fieldError?: string;
}) {
  return (
    <TextArea
      id={name}
      name={name}
      className="bg-primary rounded-lg p-2 w-full h-44 md:h-52"
      defaultValue={defaultValue ? defaultValue : ''}
      labelText="Post Text"
      fieldError={fieldError}
      required
      minLength={3}
      maxLength={1500}
    />
  );
}
