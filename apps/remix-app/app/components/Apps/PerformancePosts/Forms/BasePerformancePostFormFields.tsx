import RatingTierRankSelectMenu, { ratingTierRankOptions } from './FormComponents/RatingTierRankSelectMenu';
import PostTagMultiSelectMenu from './FormComponents/PostTagMultiSelectMenu';
import type { PostTagMultiSelectOption } from './FormComponents/PostTagMultiSelectMenu';
// import SystemSelectMenuCard from './FormComponents/SystemSelectMenuCard';
import FormRatingDisplay from './FormRatingDisplay';
import { Editor } from './FormComponents/LexicalEditor';
import FrameRateRating from './FormComponents/FrameRateRating';
import GamepadRating from './FormComponents/GamepadRating';
import { PerformancePostFormStateActions, usePerformancePostFormState } from './FormContext/PerformancePostFormContext';
import { useEffect } from 'react';
import type {
  CreateOrEditPerformancePostActionData,
} from '~/lib/form-actions/performance-post/types';
import {
  initialFrameRateStuttersValue,
  initialFrameRateTierRankSelectOption,
  initialGamepadOption,
  initialGamepadTierRankOption,
  initialPostTagMultiSelectOption,
  initialRatingTierRankSelectOption,
  initialSystemSpecOption,
} from './FormContext/initialFormOptions';
import { frameRateTierRankOptions } from './FormComponents/FrameRateRating/FrameRateTierRankRadioGroup';
import type { GamepadSelectOption } from './FormComponents/GamepadRating/GamepadSelectMenu';
import { gamepadTierRankOptions } from './FormComponents/GamepadRating/GamepadTierRankRadioGroup';
import type { SystemSpecSelectOption } from './FormComponents/SystemSelectMenuCard/SystemSelectMenu';
import SystemSelect from './FormComponents/SystemSelect';

interface BasePerformancePostFormFieldsProps {
  formId: string;
  formError?: CreateOrEditPerformancePostActionData['formError'];
  fieldErrors?: CreateOrEditPerformancePostActionData['fieldErrors'];
  fields?: CreateOrEditPerformancePostActionData['fields']; // used for defaultValue options
  editorPlaceholderText: string;
  postTagOptions: PostTagMultiSelectOption[];
  gamepadOptions: GamepadSelectOption[];
  systemSpecOptions: SystemSpecSelectOption[];
  wasSubmittedSuccessfully: boolean;
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
  wasSubmittedSuccessfully,
}: BasePerformancePostFormFieldsProps) {
  const { dispatch } = usePerformancePostFormState();

  useEffect(() => {
    if (fields) {
      const defaultRatingTierRankOption = ratingTierRankOptions
          .find((option) => option.value === fields.ratingTierRank);
      const defaultFrameRateTierRankOption = frameRateTierRankOptions
          .find((option) => option.value === fields.frameRateTierRank);
      const defaultGamepadOption = gamepadOptions
          .find((option) => option.value === fields.gamepadId);
      const defaultGamepadTierRankOption = gamepadTierRankOptions
          .find((option) => option.value === fields.gamepadTierRank);
      const defaultSystemSpecOption = systemSpecOptions
          .find((option) => option.value === fields.systemSpecId);
      dispatch({
        type: PerformancePostFormStateActions.UPSERT_FORM_STATE,
        payload: {
          ratingTierRankSelectedOption: defaultRatingTierRankOption
            ? defaultRatingTierRankOption
            : initialRatingTierRankSelectOption,
          frameRateTierRankSelectedOption: defaultFrameRateTierRankOption
            ? defaultFrameRateTierRankOption
            : initialFrameRateTierRankSelectOption,
          frameRateStuttersValue: fields.frameRateStutters
            ? fields.frameRateStutters
            : initialFrameRateStuttersValue,
          gamepadSelectedOption: defaultGamepadOption
            ? { name: defaultGamepadOption.name, value: defaultGamepadOption.value }
            : initialGamepadOption,
          gamepadTierRankSelectedOption: defaultGamepadTierRankOption
            ? defaultGamepadTierRankOption
            : initialGamepadTierRankOption,
          postTagMultiSelectOption: fields.postTagIds
            ? postTagOptions
                .filter((option) => fields.postTagIds?.includes(option.value))
                .map((option) => ({ label: option.label, value: option.value }))
            : initialPostTagMultiSelectOption,
          systemSpecSelectedOption: defaultSystemSpecOption
            ? { name: defaultSystemSpecOption.name, value: defaultSystemSpecOption.value }
            : initialSystemSpecOption,
        },
      });
    } else if (wasSubmittedSuccessfully) {
      dispatch({
        type: PerformancePostFormStateActions.RESET_FORM_STATE,
        payload: undefined,
      });
    }
  }, [
    dispatch,
    fields,
    gamepadOptions,
    systemSpecOptions,
    postTagOptions,
    wasSubmittedSuccessfully,
  ]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-xl">
      <div className="flex gap-x-4 gap-y-4 lg:justify-between flex-wrap">
        <RatingTierRankSelectMenu />
        <FrameRateRating />
        <GamepadRating gamepads={gamepadOptions} />
        <SystemSelect systemSpecOptions={systemSpecOptions} />
      </div>
      <Editor
        defaultState={
          fields &&
          fields.postContent
            ? {
              postText: fields.postContent.postText,
              postHTML: fields.postContent.postHTML,
              serializedLexicalEditorState: fields.postContent.serializedLexicalEditorState,
            } : undefined}
        placeholderText={editorPlaceholderText}
        resetEditorState={wasSubmittedSuccessfully}
      />
      <FormRatingDisplay />
      <PostTagMultiSelectMenu
        formId={formId} // TODO: Change to appropriate ID
        postTagOptions={postTagOptions}
      />
      {/* <SystemSelectMenuCard
        systemSpecOptions={systemSpecOptions}
      /> */}
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
