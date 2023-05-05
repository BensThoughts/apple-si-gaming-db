import type {
  SystemSpecOption,
  GamepadOption,
  PostTagOption,
} from '~/types';
import RatingTierRankSelectMenu, { ratingTierRankOptions } from './FormComponents/RatingTierRankSelectMenu';
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
import { initialFrameRateTierRankSelectOption, initialGamepadOption, initialGamepadTierRankOption, initialRatingTierRankSelectOption, initialSystemSpecOption } from './FormContext/initialValues';
import { frameRateAverageOptions } from '../Forms/FormComponents/FrameRateTierRankSelectMenu';
import { gamepadTierRankOptions } from './FormComponents/GamepadRating/GamepadTierRankRadioGroup';

interface BasePerformancePostFormFieldsProps {
  formId: string;
  formError?: CreateOrEditPerformancePostActionData['formError'];
  fields?: CreateOrEditPerformancePostActionData['fields']; // used for defaultValue options
  fieldErrors?: CreateOrEditPerformancePostActionData['fieldErrors'];
  editorPlaceholderText: string;
  postTagOptions: PostTagOption[];
  gamepadOptions: GamepadOption[];
  systemSpecOptions: SystemSpecOption[];
  isSubmittingForm: boolean;
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
  isSubmittingForm,
}: BasePerformancePostFormFieldsProps) {
  const { dispatch } = usePerformancePostFormState();

  useEffect(() => {
    if (fields) {
      const defaultRatingTierRankOption = ratingTierRankOptions
          .find((option) => option.value === fields.ratingTierRank);
      const defaultFrameRateTierRankOption = frameRateAverageOptions
          .find((option) => option.value === fields.frameRateTierRank);
      const defaultGamepadOption = gamepadOptions
          .find((option) => option.id === fields.gamepadId);
      const defaultGamepadTierRankOption = gamepadTierRankOptions
          .find((option) => option.value === fields.gamepadTierRank);
      const defaultSystemSpecOption = systemSpecOptions
          .find((option) => option.id === fields.systemSpecId);
      dispatch({
        type: PerformancePostFormStateActions.UPSERT_FORM_STATE,
        payload: {
          ratingTierRankSelectedOption: defaultRatingTierRankOption ? defaultRatingTierRankOption : initialRatingTierRankSelectOption,
          frameRateTierRankSelectedOption: defaultFrameRateTierRankOption ? defaultFrameRateTierRankOption : initialFrameRateTierRankSelectOption,
          frameRateStuttersValue: fields.frameRateStutters ? fields.frameRateStutters : false,
          gamepadSelectedOption: defaultGamepadOption
            ? { name: defaultGamepadOption.description, value: defaultGamepadOption.id }
            : initialGamepadOption,
          gamepadTierRankSelectedOption: defaultGamepadTierRankOption ? defaultGamepadTierRankOption : initialGamepadTierRankOption,
          systemSpecSelectedOption: defaultSystemSpecOption
            ? { name: defaultSystemSpecOption.systemName, value: defaultSystemSpecOption.id }
            : initialSystemSpecOption,
        },
      });
    } else if (isSubmittingForm) {
      dispatch({
        type: PerformancePostFormStateActions.RESET_FORM_STATE,
        payload: undefined,
      });
    }
  }, [dispatch, fields, gamepadOptions, systemSpecOptions, isSubmittingForm]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-x-2 gap-y-4 justify-between flex-wrap">
        <RatingTierRankSelectMenu />
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
        <div className="w-full flex flex-col gap-2 items-center">
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
