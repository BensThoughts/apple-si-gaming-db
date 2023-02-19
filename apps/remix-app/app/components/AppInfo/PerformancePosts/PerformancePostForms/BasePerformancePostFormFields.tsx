import { useState } from 'react';
import ToggleSwitch from '~/components/FormComponents/ToggleSwitch';
import RemixUnderlineLink from '~/components/RemixUnderlineLink';
import type { FrameRate, RatingMedal, GamepadRating } from '~/interfaces';
import PerformancePostTextArea from './FormComponents/PerformancePostTextArea';
import RatingMedalSelectMenu from './FormComponents/RatingMedalSelectMenu';
import FrameRateAverageSelectMenu from './FormComponents/FrameRateAverageSelectMenu';
import GamepadRatingSelectMenu from './FormComponents/GamepadRatingSelectMenu';
import GamepadMultiSelectMenu from './FormComponents/GamepadMultiSelectMenu';
import PostTagMultiSelectMenu from './FormComponents/PostTagMultiSelectMenu';
import SystemNameSelectMenu from './FormComponents/SystemNameSelectMenu';

interface BasePerformancePostFormFieldsProps {
  systemNames: string[];
  fields?: { // used for defaultValue options
    postText?: string;
    frameRateAverage?: FrameRate | null;
    frameRateStutters?: boolean;
    ratingMedal?: RatingMedal;
    // systemName?: string;
    postTagsIds?: number[];
    gamepadId?: number;
    gamepadRating?: GamepadRating | null;
  };
  fieldErrors?: {
    postText?: string;
    frameRateAverage?: string;
    ratingMedal?: string;
    systemName?: string;
    postTags?: string;
    gamepadId?: string;
    gamepadRating?: string;
  };
  postTagOptions: {
    postTagId: number;
    description: string;
  }[];
  gamepadOptions: {
    gamepadId: number;
    description: string;
  }[];
}

export default function BasePerformancePostFormFields({
  systemNames,
  fields,
  fieldErrors,
  postTagOptions,
  gamepadOptions,
}: BasePerformancePostFormFieldsProps) {
  const [frameRateStable, setFrameRateStable] = useState(
    fields?.frameRateStutters !== undefined
      ? fields.frameRateStutters
      : false,
  );

  return (
    <>
      <PerformancePostTextArea
        defaultValue={fields?.postText}
        fieldError={fieldErrors?.postText}
      />
      <div className="flex flex-col gap-6 w-full max-w-md">
        <div className="z-[30]">
          <RatingMedalSelectMenu
            defaultValue={fields?.ratingMedal}
            fieldError={fieldErrors?.ratingMedal}
          />
        </div>
        <div className="z-[29] flex flex-col md:flex-row gap-6 items-start md:items-center justify-center md:justify-between w-full">
          <div>
            <FrameRateAverageSelectMenu
              defaultValue={fields?.frameRateAverage}
              fieldError={fieldErrors?.frameRateAverage}
            />
          </div>
          <div>
            <ToggleSwitch
              checked={frameRateStable}
              onChange={setFrameRateStable}
              name="performancePostFrameRateStutters"
              label="Stutters"
            />
          </div>
        </div>
        <div className="z-[28]">
          <GamepadMultiSelectMenu
            formId="TODO-FIX" // TODO: Change to appropriate ID
            gamepads={gamepadOptions}
            defaultGamepadId={fields?.gamepadId}
            fieldError={fieldErrors?.gamepadId}
          />
        </div>
        <div className="z-[27]">
          <GamepadRatingSelectMenu
            defaultValue={fields?.gamepadRating}
            fieldError={fieldErrors?.gamepadRating}
          />
        </div>
        <div className="z-[26]">
          <PostTagMultiSelectMenu
            formId="TODO-FIX" // TODO: Change to appropriate ID
            postTags={postTagOptions}
            defaultPostTagIds={fields?.postTagsIds}
            fieldError={fieldErrors?.postTags}
          />
        </div>
      </div>
      <div
        className="flex flex-col gap-2 justify-center items-center rounded-md
                     md:border-1 md:border-secondary-highlight p-4"
      >
        <div className="text-primary-faded">
            You can choose to select a system from your&nbsp;
          <RemixUnderlineLink to="/profile/systems">
              profile
          </RemixUnderlineLink>
            &nbsp;to easily attach system information to your post.
        </div>
        <SystemNameSelectMenu
          systemNames={systemNames}
        />
      </div>
    </>
  );
}