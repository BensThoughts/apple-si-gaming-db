import RoundedButton from '../../RoundedButton';
import Input from '~/components/FormComponents/Input';
import { Form } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { showToast } from '~/components/Toasts';

const FORM_NAME = 'game-search-form';

type SearchInputProps = {
  componentSize: 'large' | 'medium';
  formError?: string;
  fieldErrors?: { searchQuery?: string };
  isSubmitting: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>

export default function SearchInputForm({
  isSubmitting,
  formError,
  fieldErrors,
  componentSize = 'large',
  ...rest
}: SearchInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  let buttonHeight = 'h-[46px]';
  if (componentSize === 'medium') {
    buttonHeight = 'h-[38px]';
  }

  // TODO: Doesn't seem to appear when inside useEffect
  // TODO: it appears twice when not in useEffect
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
      <div className={`flex justify-center items-center gap-2`}>
        <div>
          <input type="hidden" name="page" value="1" />
          <Input
            name="searchQuery"
            id="searchQuery"
            label="Search Games..."
            componentSize={componentSize}
            fieldError={fieldErrors ? fieldErrors.searchQuery : undefined}
            minLength={2}
            maxLength={100}
            required
            {...rest}
          />
        </div>
        <RoundedButton
          className={`${buttonHeight} w-[89.66px]`}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Loading' : 'Search' }
        </RoundedButton>
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
