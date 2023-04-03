import RoundedButton from '~/components/Buttons/RoundedButton';
import MaterialInputOutlined from '~/components/FormComponents/MaterialInputOutlined';
import { Form } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { showToast } from '~/components/Toasts';
import { SearchFormURLParams } from '~/lib/enums/URLSearchParams/Search';

const FORM_NAME = 'game-search-form';

type SimpleSearchInputProps = {
  formError?: string;
  fieldErrors?: { searchQuery?: string };
  isSubmitting: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>

export default function SimpleSearchForm({
  isSubmitting,
  formError,
  fieldErrors,
  ...rest
}: SimpleSearchInputProps) {
  const formRef = useRef<HTMLFormElement>(null);

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
      <div className="flex justify-center items-center gap-2">
        <div>
          <input type="hidden" name="page" value="1" />
          <MaterialInputOutlined
            name={SearchFormURLParams.APP_NAME}
            id={`${FORM_NAME}_appName`}
            label="Search Games..."
            componentSize="small"
            fieldError={fieldErrors ? fieldErrors.searchQuery : undefined}
            // minLength={2}
            maxLength={100}
            // required
            {...rest}
          />
        </div>
        <RoundedButton
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Loading' : 'Search' }
        </RoundedButton>
      </div>
    </Form>
  );
}
