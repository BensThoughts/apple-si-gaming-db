import { Form } from '@remix-run/react';
import RoundedButton from '~/components/RoundedButton';
import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import type { CreatePerformancePostActionData } from '~/routes/apps/$steamAppId/performance-posts';
import React, { useEffect, useRef, useState } from 'react';
import TextArea from '~/components/FormComponents/TextArea';
import ToggleSwitch from '~/components/FormComponents/ToggleSwitch';
import MultiSelectMenu from '~/components/FormComponents/MultiSelectMenu';
import type { MultiSelectOption } from '~/components/FormComponents/MultiSelectMenu';
import { showToast } from '~/components/Toasts';
import RemixUnderlineLink from '~/components/RemixUnderlineLink';
import {
  steamAppRatingOptions,
  frameRateAverageOptions,
  gamepadRatingOptions,
} from './ratingOptions';

interface PerformancePostFormProps {
  steamAppId: number;
  steamUser: {
    isLoggedIn: boolean;
    ownsApp: boolean;
    systemNames: string[];
  }
  fields: CreatePerformancePostActionData['fields'];
  fieldErrors: CreatePerformancePostActionData['fieldErrors'];
  formError: CreatePerformancePostActionData['formError'];
  isSubmittingForm: boolean;
  postTags: {
    postTagId: number;
    description: string;
  }[];
  gamepads: {
    gamepadId: number;
    description: string;
  }[];
}

function Wrapper({
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-col gap-3 items-center justify-center bg-tertiary
                     border-solid border-1 border-secondary p-3 rounded-lg w-full`}>
      {children}
    </div>
  );
}

export default function PerformancePostForm({
  steamAppId,
  steamUser,
  fields,
  formError,
  fieldErrors,
  isSubmittingForm,
  postTags,
  gamepads,
}: PerformancePostFormProps) {
  const {
    isLoggedIn,
    ownsApp,
    systemNames,
  } = steamUser;
  const [frameRateStable, setFrameRateStable] = useState(false);

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

  if (!isLoggedIn) {
    return (
      <Wrapper>
        <div>
          You are not logged in. You must&nbsp;
          <RemixUnderlineLink to="/profile">
            login
          </RemixUnderlineLink>
          &nbsp;to post a performance review for this app.
        </div>
      </Wrapper>
    );
  }
  if (!ownsApp) {
    return (
      <Wrapper>
        <div className="w-full">
          It looks like you do not own this app yet. Please add it to your steam library to leave a
          performance review.
        </div>
      </Wrapper>
    );
  }

  const postTagOptions: MultiSelectOption<number>[] = postTags.map((tag) => (
    {
      label: tag.description,
      value: tag.postTagId,
    }
  ));
  const systemNameOptions: SelectOption[] = systemNames.map((sysName) => (
    {
      name: sysName,
      value: sysName,
    }
  ));
  // ! Added to avoid needing system info
  systemNameOptions.unshift({
    name: 'None',
    value: 'None',
  });

  const gamepadOptions: MultiSelectOption<number>[] = gamepads.map((gamepad) => (
    {
      label: gamepad.description,
      value: gamepad.gamepadId,
    }
  ));
  gamepadOptions.unshift({
    label: 'None',
    value: 0,
  });

  return (
    <Wrapper>
      <h2 className="text-secondary text-lg">Submit Your Own Performance Post</h2>
      {formError && <div className="text-color-error">{formError}</div>}
      <Form
        method="post"
        name="performancePost"
        ref={formRef}
        className="flex flex-col items-center gap-8 w-full max-w-lg"
        action={`/apps/${steamAppId}/performance-posts`}
      >
        <input type="hidden" name="_performancePostAction" value="createPerformancePost" />
        <TextArea
          id="performancePostText"
          name="performancePostText"
          className="bg-primary rounded-lg p-2 w-full h-28"
          defaultValue={fields?.postText ? fields.postText : ''}
          labelText="Post Text"
          fieldError={fieldErrors?.postText ? fieldErrors.postText : undefined}
          required
          minLength={3}
          maxLength={1500}
        />
        <div className="flex flex-col gap-6 w-full max-w-md">
          <div className="z-[30]">
            <SelectMenu
              name="performancePostRatingMedal"
              defaultValue={{
                name: 'None',
                value: 'None',
              }}
              options={steamAppRatingOptions}
              labelText="Rating"
              required
              fieldError={fieldErrors?.ratingMedal}
            />
          </div>
          <div className="z-[29] flex flex-col md:flex-row gap-6 items-start md:items-center justify-center md:justify-between w-full">
            <div>
              <SelectMenu
                name="performancePostFrameRateAverage"
                defaultValue={{ name: 'Not Sure', value: 'None' }}
                options={frameRateAverageOptions}
                labelText="Average Frame Rate"
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
            <MultiSelectMenu
              name="performancePostGamepadId"
              id={`performancePostGamepadId-${steamAppId}`}
              labelText="Controller"
              options={gamepadOptions}
              fieldError={fieldErrors?.gamepadId}
              isMulti={false}
              closeMenuOnSelect={true}
            />
          </div>
          <div className="z-[27]">
            <SelectMenu
              name="performancePostGamepadRating"
              defaultValue={{ name: 'None', value: 'None' }}
              options={gamepadRatingOptions}
              labelText="Controller Rating"
              fieldError={fieldErrors?.gamepadRating}
              menuSize="large"
            />
          </div>
          <div className="z-[26]">
            <MultiSelectMenu
              name="performancePostTags"
              id={`performancePostTags-${steamAppId}`}
              labelText="Tags"
              options={postTagOptions}
              fieldError={fieldErrors?.postTags}
              isMulti={true}
              closeMenuOnSelect={false}
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
          <SelectMenu
            name="performancePostSystemName"
            defaultValue={systemNameOptions[0]}
            options={systemNameOptions}
            labelText="Select System"
          />
        </div>
        <RoundedButton type="submit" className="max-w-xs">
          {isSubmittingForm ? 'Submitting' : 'Submit'}
        </RoundedButton>
      </Form>
    </Wrapper>
  );
}
