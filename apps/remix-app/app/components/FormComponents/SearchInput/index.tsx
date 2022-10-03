import RoundedButton from '../../RoundedButton';
import Input from '~/components/FormComponents/Input';
import { Form } from '@remix-run/react';
import { useEffect, useRef } from 'react';

const FORM_NAME = 'game-search-form';

type SearchInputProps = {
  componentSize: 'large' | 'medium';
  fieldError?: string;
  isSubmitting: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>

export default function SearchInput({
  isSubmitting,
  fieldError,
  componentSize = 'large',
  ...rest
}: SearchInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  let buttonHeight = 'h-[46px]';
  if (componentSize === 'medium') {
    buttonHeight = 'h-[38px]';
  }

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
            fieldError={fieldError}
            minLength={1}
            maxLength={100}
            required
            {...rest}
          />
        </div>
        <RoundedButton
          className={`${buttonHeight} w-[89.66px]
                      ${isSubmitting ? 'bg-primary-highlight hover:bg-primary-highlight' : 'bg-secondary'}
                    `}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Loading' : 'Search' }
        </RoundedButton>
      </div>
      {fieldError ? <div className="text-color-error">{fieldError}</div> : null}
    </Form>
  );
}
