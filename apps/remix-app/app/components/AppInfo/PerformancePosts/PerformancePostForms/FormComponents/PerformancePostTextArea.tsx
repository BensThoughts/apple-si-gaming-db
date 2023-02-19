import TextArea from '~/components/FormComponents/TextArea';

export default function PerformancePostTextArea({
  defaultValue,
  fieldError,
}: {
  defaultValue?: string;
  fieldError?: string;
}) {
  return (
    <TextArea
      id="performancePostText"
      name="performancePostText"
      className="bg-primary rounded-lg p-2 w-full h-28"
      defaultValue={defaultValue ? defaultValue : ''}
      labelText="Post Text"
      fieldError={fieldError}
      required
      minLength={3}
      maxLength={1500}
    />
  );
}
