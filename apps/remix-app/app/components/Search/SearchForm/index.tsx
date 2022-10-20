import RoundedButton from '../../RoundedButton';
import Input from '~/components/FormComponents/Input';
import { Form } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { showToast } from '~/components/Toasts';
import UncontrolledToggleSwitch from '~/components/FormComponents/ToggleSwitch/UncontrolledToggleSwitch';
import MultiSelectMenu from '~/components/FormComponents/MultiSelectMenu';
import type { MultiSelectOption } from '~/components/FormComponents/MultiSelectMenu';
import type { SearchPageLoaderDataFormFields } from '~/routes/search/index';

const FORM_NAME = 'game-search-form';

type SearchInputProps = {
  componentSize: 'large' | 'small';
  formError?: string;
  fieldErrors?: { searchQuery?: string };
  // fields: SearchPageLoaderDataFormFields;
  isSubmitting: boolean;
  genreOptions: MultiSelectOption[];
  categoryOptions: MultiSelectOption[];
} & React.InputHTMLAttributes<HTMLInputElement>

export default function SearchInputForm({
  genreOptions,
  categoryOptions,
  isSubmitting,
  formError,
  fieldErrors,
  componentSize = 'large',
  ...rest
}: SearchInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  let buttonHeight = 'h-[46px]';
  if (componentSize === 'small') {
    buttonHeight = 'h-[38px]';
  }

  // TODO: showToast doesn't seem to appear when inside useEffect
  // TODO: it appears twice when not in useEffect fieldErrors vs formError
  if (formError) {
    showToast.error(formError);
  }

  useEffect(() => {
    if (fieldErrors?.searchQuery) {
      showToast.error(fieldErrors.searchQuery);
    }
  }, [fieldErrors]);

  useEffect(() => {
    if (isSubmitting) {
      formRef.current?.reset();
    }
  }, [isSubmitting]);

  return (
    <Form
      id={FORM_NAME}
      name={FORM_NAME}
      method="get"
      action="/search"
      ref={formRef}
    >
      <div className="flex flex-col gap-4">
        <div className={`flex justify-center items-center gap-2`}>
          <input type="hidden" name="page" value="1" />
          <Input
            name="searchQuery"
            id="searchQuery"
            label="Search Games..."
            componentSize={componentSize}
            fieldError={fieldErrors ? fieldErrors.searchQuery : undefined}
            // minLength={2}
            maxLength={100}
            // required
            {...rest}
          />
          <RoundedButton
            className={`${buttonHeight} w-[89.66px]`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Loading' : 'Search' }
          </RoundedButton>
        </div>
        <div className="flex items-center gap-4">
          <UncontrolledToggleSwitch
            defaultChecked={false}
            name="searchAppleOnly"
            label="Apple"
          />
        </div>
        <div>
          <MultiSelectMenu
            name="searchGenreIds"
            labelText="Genres"
            options={genreOptions}
            openMenuOnFocus={false}
            closeMenuOnSelect={true}
            isMulti
          />
        </div>
        <div>
          <MultiSelectMenu
            name="searchCategoryIds"
            labelText="Categories"
            options={categoryOptions}
            openMenuOnFocus={false}
            closeMenuOnSelect={true}
            isMulti
          />
        </div>
      </div>

      {(fieldErrors && fieldErrors.searchQuery) ? (
        <div className="text-color-error">
          {fieldErrors.searchQuery}
        </div>
      ) : (
        null
      )}
    </Form>
  );
}
