import { Form, Link } from '@remix-run/react';
import RoundedButton from '~/components/RoundedButton';
import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import type { CreateGamepadPostActionData } from '~/routes/apps/$steamAppId/controller-posts';
import type { RatingMedal } from '~/interfaces/database';
import AnimatedUnderline from '~/components/AnimatedUnderline';
import React, { useEffect, useRef } from 'react';
import TextArea from '~/components/FormComponents/TextArea';
import MultiSelectMenu from '~/components/FormComponents/MultiSelectMenu';
import type { MultiSelectOption } from '~/components/FormComponents/MultiSelectMenu';
import { showToast } from '~/components/Toasts';

const ratingOptions: SelectOption<RatingMedal | 'None'>[] = [
  {
    name: 'None',
    value: 'None',
  },
  {
    name: 'Platinum - Runs [ perfect ]',
    value: 'Platinum',
  },
  {
    name: 'Gold - Runs [ perfect after tweaks ]',
    value: 'Gold',
  },
  {
    name: 'Silver - Runs [ with minor issues ]',
    value: 'Silver',
  },
  {
    name: 'Bronze - Runs [ often crashes ]',
    value: 'Bronze',
  },
  {
    name: `Borked - Doesn't Run`,
    value: 'Borked',
  },
];

interface GamepadPostFormProps {
  steamAppId: number;
  steamUser: {
    isLoggedIn: boolean;
    ownsApp: boolean;
    systemNames: string[];
  }
  fields: CreateGamepadPostActionData['fields'];
  fieldErrors: CreateGamepadPostActionData['fieldErrors'];
  formError: CreateGamepadPostActionData['formError'];
  isSubmittingForm: boolean;
  postTags: {
    postTagId: number;
    description: string;
  }[];
  gamepads: {
    gamepadId: number;
    label: string;
  }[]
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

export default function GamepadPostForm({
  steamAppId,
  steamUser,
  fields,
  formError,
  fieldErrors,
  isSubmittingForm,
  postTags,
  gamepads,
}: GamepadPostFormProps) {
  const {
    isLoggedIn,
    ownsApp,
    systemNames,
  } = steamUser;
  const gamepadOptions: MultiSelectOption<number>[] = gamepads.map((gamepad) => (
    {
      label: gamepad.label,
      value: gamepad.gamepadId,
    }
  ));
  gamepadOptions.unshift({
    label: 'None',
    value: -1,
  });
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
          <Link to="/profile">
            <AnimatedUnderline>
              <span className="text-secondary">login</span>
            </AnimatedUnderline>
          </Link>
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

  // ! Removed to avoid needing system info
  // if (steamUserSystemNames.length < 1) {
  //   return (
  //     <Wrapper>
  //       <div>
  //         You need to add a system to your&nbsp;
  //         <Link to="/profile">
  //           <AnimatedUnderline>
  //             <span className="text-secondary">profile</span>
  //           </AnimatedUnderline>
  //         </Link>
  //         &nbsp;to post a performance review for this app.
  //       </div>
  //     </Wrapper>
  //   );
  // }

  return (
    <Wrapper>
      <h2 className="text-secondary text-lg">Submit Your Own Performance Post</h2>
      {formError && <div className="text-color-error">{formError}</div>}
      <Form
        method="post"
        name="gamepadPost"
        ref={formRef}
        className="flex flex-col items-center gap-8 w-full max-w-lg"
        action={`/apps/${steamAppId}/performance-posts`}
      >
        <input type="hidden" name="_performancePostAction" value="createPost" />
        <TextArea
          id="gamepadPostText"
          name="gamepadPostText"
          className="bg-primary rounded-lg p-2 w-full h-28"
          defaultValue={fields?.postText ? fields.postText : ''}
          labelText="Post Text"
          fieldError={fieldErrors?.postText ? fieldErrors.postText : undefined}
          required
          minLength={3}
          maxLength={1500}
        />
        <div className="flex flex-col gap-6 w-full max-w-md">
          <div className="z-30">
            <MultiSelectMenu
              name="gamepadPostGamepad"
              id="gamepadPostGamepad"
              labelText="Gamepad"
              isMulti={false}
              closeMenuOnSelect={true}
              // labelText="Gamepad"
              // defaultValue={{
              //   label: 'None',
              //   value: -1,
              // }}
              options={gamepadOptions}
              // required
              fieldError={fieldErrors?.gamepad}
            />
          </div>
          <div className="z-20">
            <SelectMenu
              name="gamepadPostRatingMedal"
              defaultValue={{
                name: 'None',
                value: 'None',
              }}
              options={ratingOptions}
              labelText="Rating"
              required
              fieldError={fieldErrors?.ratingMedal}
            />
          </div>
          <div className="z-10">
            <MultiSelectMenu
              name="gamepadPostTags"
              id="gamepadPostTags"
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
            <Link to="/profile">
              <AnimatedUnderline>
                <span className="text-secondary">profile</span>
              </AnimatedUnderline>
            </Link>
            &nbsp;to easily attach system information to your post.
          </div>
          <SelectMenu
            name="gamepadPostSystemName"
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