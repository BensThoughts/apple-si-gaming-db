import type {
  RatingTierRank,
  FrameRateTierRank,
  GamepadTierRank,
  SystemSpecOption,
  GamepadOption,
  PostTagOption,
} from '~/types';
import RatingTierRankSelectMenu from './FormComponents/RatingTierRankSelectMenu';
import PostTagMultiSelectMenu from './FormComponents/PostTagMultiSelectMenu';
import SystemSelectMenuCard from './FormComponents/SystemSelectMenuCard';
import FormRatingDisplay from './FormRatingDisplay';
import { Editor } from './FormComponents/LexicalEditor';
import FrameRateRatingPopover from './FormComponents/FrameRateRatingPopover/FrameRateRatingPopover';
import GamepadRatingPopover from './FormComponents/GamepadRatingPopover';
import { PerformancePostFormStateActions, usePerformancePostFormState } from './FormContext/PerformancePostFormContext';
import { useEffect } from 'react';

interface BasePerformancePostFormFieldsProps {
  formError?: string;
  fields?: { // used for defaultValue options
    postText?: string;
    frameRateTierRank?: FrameRateTierRank | null;
    frameRateStutters?: boolean;
    ratingTierRank?: RatingTierRank;
    postTagsIds?: number[];
    gamepadId?: number;
    gamepadTierRank?: GamepadTierRank | null;
    systemSpecId?: number;
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
  postTagOptions: PostTagOption[];
  gamepadOptions: GamepadOption[];
  systemSpecOptions: SystemSpecOption[];
}

export default function BasePerformancePostFormFields({
  fields,
  formError,
  fieldErrors,
  postTagOptions,
  gamepadOptions,
  systemSpecOptions,
}: BasePerformancePostFormFieldsProps) {
  const { dispatch } = usePerformancePostFormState();

  useEffect(() => {
    if (fields) {
      dispatch({
        type:PerformancePostFormStateActions.UPSERT_FORM_STATE,
        payload: {
          ratingTierRank: fields.ratingTierRank,
          frameRateTierRank: fields.frameRateTierRank ? fields.frameRateTierRank : undefined,
          frameRateStutters: fields.frameRateStutters ? fields.frameRateStutters : false,
          gamepadValue: fields.gamepadId ? fields.gamepadId : undefined,
          gamepadTierRank: fields.gamepadTierRank ? fields.gamepadTierRank : undefined,
        }
      });
    }
  }, [dispatch, fields])

  return (
      <div className="flex flex-col gap-6">
        <div className="flex gap-2">
          <RatingTierRankSelectMenu defaultRatingTierRank={fields?.ratingTierRank} />
          <FrameRateRatingPopover />
          <GamepadRatingPopover gamepads={gamepadOptions} />
        </div>
        <Editor />
        <FormRatingDisplay />
        <PostTagMultiSelectMenu
          formId="TODO-FIX" // TODO: Change to appropriate ID
          postTags={postTagOptions}
          defaultPostTagIds={fields?.postTagsIds}
          fieldError={fieldErrors?.postTags}
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
