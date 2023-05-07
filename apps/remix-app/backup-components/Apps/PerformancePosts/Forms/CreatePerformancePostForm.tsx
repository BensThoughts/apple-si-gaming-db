// @ts-nocheck
import { Form } from '@remix-run/react';
import RoundedButton from '~/components/Buttons/RoundedButton';
import { useEffect, useRef } from 'react';
import { showToast } from '~/components/Toasts';
import RemixUnderlineLink from '~/components/RemixUnderlineLink';
import type {
  RatingTierRank,
  FrameRateTierRank,
  GamepadTierRank,
  SystemSpecOption,
} from '~/types/remix-app';
import PerformancePostFormWrapper from './PerformancePostFormWrapper';
import BasePerformancePostFormFields from './BasePerformancePostFormFields';
import { useUserSession } from '~/lib/hooks/useMatchesData';

interface CreatePerformancePostFormProps {
  steamAppId: number;
  fields?: { // used for defaultValue options
    postText?: string;
    frameRateTierRank?: FrameRateTierRank | null;
    frameRateStutters?: boolean;
    ratingTierRank?: RatingTierRank;
    // systemName?: string;
    postTagsIds?: number[];
    gamepadId?: number;
    gamepadTierRank?: GamepadTierRank | null;
  };
  fieldErrors?: {
    postText?: string;
    frameRateTierRank?: string;
    ratingTierRank?: string;
    systemName?: string;
    postTags?: string;
    gamepadId?: string;
    gamepadTierRank?: string;
  };
  formError?: string;
  isSubmittingForm: boolean;
  postTagOptions: {
    id: number;
    description: string;
  }[];
  gamepadOptions: {
    id: number;
    description: string;
  }[];
  steamUserProfileOwnsApp: boolean;
}

export default function CreatePerformancePostForm({
  steamAppId,
  fields,
  formError,
  fieldErrors,
  isSubmittingForm,
  postTagOptions,
  gamepadOptions,
  steamUserProfileOwnsApp,
}: CreatePerformancePostFormProps) {
  const { userSession } = useUserSession();

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isSubmittingForm) {
      formRef.current?.reset();
    }
  }, [isSubmittingForm]);

  useEffect(() => {
    if (formError) {
      showToast.error(formError);
    }
  }, [formError]);

  if (!userSession) {
    return (
      <PerformancePostFormWrapper>
        <div>
          You are not logged in with Steam. You must&nbsp;
          <RemixUnderlineLink to="/profile">
            login
          </RemixUnderlineLink>
          &nbsp;to post a performance review for this app.
        </div>
      </PerformancePostFormWrapper>
    );
  }

  const { userProfile } = userSession;

  if (!steamUserProfileOwnsApp) {
    return (
      <PerformancePostFormWrapper>
        <div className="w-full">
          It looks like you do not own this app yet. Please add it to your steam library to leave a
          performance review. (You may need to re-sync library as well)
        </div>
      </PerformancePostFormWrapper>
    );
  }

  const systemSpecOptions: SystemSpecOption[] = userProfile.systemSpecs
      .map(({ systemSpecId, systemName }) => ({ id: systemSpecId, systemName }));

  const formId = `${steamAppId}-CreatePerformancePost`;
  return (
    <PerformancePostFormWrapper>
      <h2 className="text-secondary text-lg">Create Post</h2>
      {formError && <div className="text-error">{formError}</div>}
      <Form
        id={formId}
        method="post"
        name="performancePost"
        ref={formRef}
        className="flex flex-col items-center gap-6 w-full max-w-lg"
        action={`/apps/${steamAppId}/posts`}
      >
        <input type="hidden" name="_performancePostAction" value="createPerformancePost" />
        <BasePerformancePostFormFields
          systemSpecOptions={systemSpecOptions}
          gamepadOptions={gamepadOptions}
          postTagOptions={postTagOptions}
          fields={fields}
          fieldErrors={fieldErrors}
        />
        <RoundedButton type="submit" disabled={isSubmittingForm} className="focus-visible:show-ring-tertiary">
          {isSubmittingForm ? 'Creating' : 'Create'}
        </RoundedButton>
      </Form>
    </PerformancePostFormWrapper>
  );
}
