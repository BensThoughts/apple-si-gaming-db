import type { SteamAppRatingMedal } from '~/interfaces';
import { Form } from '@remix-run/react';
import RoundedButton from '~/components/RoundedButton';
import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { CreatePostActionData } from '~/routes/apps/$steamAppId/performance-posts';

export default function PerformancePostForm({
  steamAppId,
  steamUserIsLoggedIn,
  steamUserOwnsApp,
  fields,
  formError,
  fieldErrors,
}: {
  steamAppId: number;
  steamUserIsLoggedIn: boolean;
  steamUserOwnsApp: boolean;
  fields: CreatePostActionData['fields'];
  fieldErrors: CreatePostActionData['fieldErrors'];
  formError: CreatePostActionData['formError'];
}) {
  const ratingOptions: SteamAppRatingMedal[] = ['None', 'Platinum', 'Gold', 'Silver', 'Borked'];
  return (
    <div className={`flex flex-col gap-3 items-center justify-center bg-app-bg
                     border-solid border-1 border-secondary p-3 rounded-lg w-full`}>
      {steamUserIsLoggedIn ? (
        <>
          {steamUserOwnsApp ? (
            <div>
              <h2 className="text-secondary text-lg">Submit Your Own Performance Post</h2>
              <Form
                method="post"
                name="performancePost"
                className="flex flex-col items-center gap-3 w-full max-w-lg"
                action={`/apps/${steamAppId}/performance-posts`}
              >
                <label className="w-full">
                  Post Text{`: `}
                  {fieldErrors?.postText ? (
                    <span className="text-color-error">
                      {fieldErrors.postText}
                    </span>
                  ) : null}
                  <textarea
                    id="performancePostText"
                    name="performancePostText"
                    className="bg-primary rounded-lg p-2 w-full h-28"
                    defaultValue={fields?.postText ? fields.postText : ''}
                  />
                </label>
                <SelectMenu
                  name="performancePostRatingMedal"
                  defaultValue={fields?.ratingMedal ? fields.ratingMedal : 'None'}
                  options={ratingOptions}
                  label="Rating"
                  errorMessage={fieldErrors?.ratingMedal}
                />
                <RoundedButton type="submit" className="max-w-xs">Submit</RoundedButton>
              </Form>
            </div>
          ): (
            <div>
              It looks like you do not own this app yet. Add it to your steam library to leave a
              performance review.
            </div>
          )}
        </>
      ): (
        <div>
          You are not logged in. You must login to post a performance review for this app.
        </div>
      )}
    </div>
  );
}
