import { useState } from 'react';
import ToggleSwitch from '~/components/FormComponents/ToggleSwitch';
import RemixUnderlineLink from '~/components/RemixUnderlineLink';
import type {
  RatingTierRank,
  FrameRateTierRank,
  GamepadTierRank,
  SystemSpecOption,
  GamepadOption,
  PostTagOption,
} from '~/types';
import { PerformancePostFieldNames } from '~/lib/enums/FormFields/PerformancePost';
import PerformancePostTextArea from './FormComponents/PerformancePostTextArea';
import RatingTierRankSelectMenu from './FormComponents/RatingTierRankSelectMenu';
import FrameRateTierRankSelectMenu from './FormComponents/FrameRateTierRankSelectMenu';
import GamepadTierRankSelectMenu from './FormComponents/GamepadTierRankSelectMenu';
import GamepadSelectMenu from './FormComponents/GamepadSelectMenu';
import PostTagMultiSelectMenu from './FormComponents/PostTagMultiSelectMenu';
import SystemSelectMenu from './FormComponents/SystemSelectMenu';

interface BasePerformancePostFormFieldsProps {
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
  fieldErrors,
  postTagOptions,
  gamepadOptions,
  systemSpecOptions,
}: BasePerformancePostFormFieldsProps) {
  const [frameRateStable, setFrameRateStable] = useState(
    fields?.frameRateStutters !== undefined
      ? fields.frameRateStutters
      : false,
  );

  return (
    <div className="flex flex-col gap-6">
      <PerformancePostTextArea
        name={PerformancePostFieldNames.PostText}
        defaultValue={fields?.postText}
        fieldError={fieldErrors?.postText}
      />
      <div className="flex flex-col gap-4 w-full max-w-md">
        <div className="z-[30]">
          <RatingTierRankSelectMenu
            name={PerformancePostFieldNames.RatingTierRank}
            defaultValue={fields?.ratingTierRank}
            fieldError={fieldErrors?.ratingTierRank}
          />
        </div>
        <div className="z-[29] flex flex-col md:flex-row gap-6 items-start md:items-center justify-center md:justify-between w-full">
          <div>
            <FrameRateTierRankSelectMenu
              name={PerformancePostFieldNames.FrameRateTierRank}
              defaultValue={fields?.frameRateTierRank}
              fieldError={fieldErrors?.frameRateTierRank}
            />
          </div>
          <div>
            <ToggleSwitch
              name={PerformancePostFieldNames.FrameRateStutters}
              checked={frameRateStable}
              onChange={setFrameRateStable}
              label="Stutters"
            />
          </div>
        </div>
        <div className="z-[28]">
          <GamepadSelectMenu
            name={PerformancePostFieldNames.GamepadId}
            // formId="TODO-FIX" // TODO: Change to appropriate ID
            gamepads={gamepadOptions}
            defaultGamepadId={fields?.gamepadId}
            fieldError={fieldErrors?.gamepadId}
          />
        </div>
        <div className="z-[27]">
          <GamepadTierRankSelectMenu
            name={PerformancePostFieldNames.GamepadTierRank}
            defaultValue={fields?.gamepadTierRank}
            fieldError={fieldErrors?.gamepadTierRank}
          />
        </div>
        <div className="z-[26]">
          <PostTagMultiSelectMenu
            formId="TODO-FIX" // TODO: Change to appropriate ID
            name={PerformancePostFieldNames.PostTagIds}
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
        <SystemSelectMenu
          name={PerformancePostFieldNames.SystemSpecId}
          systemSpecOptions={systemSpecOptions}
          defaultSystemSpecId={fields?.systemSpecId}
        />
      </div>
    </div>
  );
}
