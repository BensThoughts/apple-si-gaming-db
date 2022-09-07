import { Form } from '@remix-run/react';
import type {
  SteamUserWithoutMetadata,
} from '~/interfaces/database';
import RoundedButton from '../RoundedButton';

export default function PerformancePostForm({
  steamUser,
  userOwnsApp,
  actionData,
}: {
  steamUser?: SteamUserWithoutMetadata | null,
  userOwnsApp: boolean,
  actionData: any,
}) {
  return (
    <div className={`flex flex-col items-center justify-center bg-primary
                     border-solid border-1 border-secondary p-3 rounded-lg`}>
      {steamUser ? (
        <div>
          {userOwnsApp ? (
            <div>
              Looks like you own the app, go ahead and leave a performance post.
              <Form
                method="post"
                name="performancePost"
                className="flex flex-col items-center gap-3 w-full max-w-lg"
              >
                <label>
              Post:
                  <textarea
                    name="postText"
                    className="bg-primary rounded p-2 w-full"
                    defaultValue={actionData?.values.postText}
                  />
                </label>
                <RoundedButton type="submit" className="max-w-xs">Submit</RoundedButton>
              </Form>
            </div>
          ): (
            <div>
              It looks like you do not own this app yet. Add it to your steam library to leave a
              performance review.
            </div>
          )}
        </div>
      ): (
        <div>
          You are not logged in. You must login to post a performance review for this app.
        </div>
      )}
    </div>
  );
}
