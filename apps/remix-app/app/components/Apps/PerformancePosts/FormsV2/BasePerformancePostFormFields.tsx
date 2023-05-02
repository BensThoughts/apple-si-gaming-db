import type {
  SystemSpecOption,
  GamepadOption,
  PostTagOption,
} from '~/types';
import RatingTierRankSelectMenu from './FormComponents/RatingTierRankSelectMenu';
import PostTagMultiSelectMenu from './FormComponents/PostTagMultiSelectMenu';
import SystemSelectMenuCard from './FormComponents/SystemSelectMenuCard';
import FormRatingDisplay from './FormRatingDisplay';
import { Editor } from './FormComponents/LexicalEditor';
import FrameRateRating from './FormComponents/FrameRateRating';
import GamepadRating from './FormComponents/GamepadRating';
import { PerformancePostFormStateActions, usePerformancePostFormState } from './FormContext/PerformancePostFormContext';
import { useEffect } from 'react';
import type {
  CreateOrEditPerformancePostActionData,
} from '~/lib/form-actions/performance-post/types';

interface BasePerformancePostFormFieldsProps {
  formId: string;
  formError?: CreateOrEditPerformancePostActionData['formError'];
  fields?: CreateOrEditPerformancePostActionData['fields']; // used for defaultValue options
  fieldErrors?: CreateOrEditPerformancePostActionData['fieldErrors'];
  editorPlaceholderText: string;
  postTagOptions: PostTagOption[];
  gamepadOptions: GamepadOption[];
  systemSpecOptions: SystemSpecOption[];
}

export default function BasePerformancePostFormFields({
  formId,
  fields,
  formError,
  fieldErrors,
  editorPlaceholderText,
  postTagOptions,
  gamepadOptions,
  systemSpecOptions,
}: BasePerformancePostFormFieldsProps) {
  const { dispatch } = usePerformancePostFormState();

  useEffect(() => {
    if (fields) {
      dispatch({
        type: PerformancePostFormStateActions.UPSERT_FORM_STATE,
        payload: {
          ratingTierRankValue: fields.ratingTierRank ? fields.ratingTierRank : 'None',
          frameRateTierRankValue: fields.frameRateTierRank ? fields.frameRateTierRank : 'None',
          frameRateStuttersValue: fields.frameRateStutters ? fields.frameRateStutters : false,
          gamepadName: '',
          gamepadValue: fields.gamepadId ? fields.gamepadId : -1,
          gamepadTierRankValue: fields.gamepadTierRank ? fields.gamepadTierRank : 'None',
        },
      });
    }
  }, [dispatch, fields]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-x-2 gap-y-4 justify-between flex-wrap">
        <RatingTierRankSelectMenu defaultRatingTierRank={fields?.ratingTierRank} />
        <FrameRateRating />
        <GamepadRating gamepads={gamepadOptions} />
      </div>
      <Editor
        defaultState={{
          postText: fields?.postText ? fields.postText : '',
          postHTML: fields?.postHTML,
          serializedLexicalEditorState: fields?.serializedLexicalEditorState,
        }}
        placeholderText={editorPlaceholderText}
      />
      <FormRatingDisplay />
      <PostTagMultiSelectMenu
        formId={formId} // TODO: Change to appropriate ID
        postTags={postTagOptions}
        defaultPostTagIds={fields?.postTagIds}
        fieldError={fieldErrors?.postTagIds}
      />
      <SystemSelectMenuCard
        systemSpecOptions={systemSpecOptions}
        defaultSystemSpecId={fields?.systemSpecId}
      />
      {(formError || fieldErrors) && (
        <div className="w-full flex justify-center">
          {formError && <div className="text-error">{formError}</div>}
          {(fieldErrors && Object.values(fieldErrors).some(Boolean)) && (
            Object.entries(fieldErrors).map((error, idx) => (
              <div key={`${error[0]}`} className="text-error italic w-full text-center">
                {error[1]}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
