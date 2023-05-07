import MultiSelectMenu from '~/components/FormComponents/MultiSelectMenu';
import type { MultiSelectOption } from '~/components/FormComponents/MultiSelectMenu';
import type { PostTagOption } from '~/types';

export default function PostTagMultiSelectMenu({
  formId,
  name,
  postTags,
  defaultPostTagIds,
  fieldError,
}: {
  formId: string;
  name: string;
  postTags: PostTagOption[];
  defaultPostTagIds?: number[]; // defaultValue
  fieldError?: string;
}) {
  const postTagOptions: MultiSelectOption<number>[] = postTags.map((tag) => (
    {
      label: tag.description,
      value: tag.id,
    }
  ));
  const defaultValue = postTagOptions.filter((option) => defaultPostTagIds?.includes(option.value));
  return (
    <MultiSelectMenu
      name={name}
      id={`${name}-${formId}`}
      labelText="Tags"
      options={postTagOptions}
      defaultValue={defaultValue}
      fieldError={fieldError}
      closeMenuOnSelect={false}
    />
  );
}
