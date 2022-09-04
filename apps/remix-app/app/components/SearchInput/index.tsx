import RoundedButton from '../RoundedButton';
import FloatingLabelInput from './FloatingLabelInput';
import { Form, useTransition } from '@remix-run/react';

const FORM_NAME = 'game-search-form';

interface SearchInputProps {
  size: 'large' | 'medium';
}

export default function SearchInput({
  size = 'large',
}: SearchInputProps) {
  let buttonHeight = 'h-[46px]';
  if (size === 'medium') {
    buttonHeight = 'h-[38px]';
  }

  const transition = useTransition();
  const transitionState = transition.state;
  const transitioning = transitionState === 'submitting' || transitionState === 'loading';

  return (
    <Form
      id={FORM_NAME}
      name={FORM_NAME}
      method="get"
      action="/search"
    >
      <div className='flex justify-center items-center gap-2'>
        <div>
          <FloatingLabelInput
            name="searchQuery"
            label="Search Games..."
            size={size}
          />
        </div>
        <RoundedButton className={`${buttonHeight} w-[89.66px]`} type="submit" disabled={transitioning}>
          {transitioning ? 'Loading' : 'Search' }
        </RoundedButton>
      </div>
    </Form>
  );
}
