import { Form } from '@remix-run/react';
import type {
  SteamUserWithoutMetadata,
} from '~/interfaces/database';
import RoundedButton from '../RoundedButton';
import SelectMenu from '~/components/FormComponents/SelectMenu';

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
    <div className={`flex flex-col gap-3 items-center justify-center bg-app-bg
                     border-solid border-1 border-secondary p-3 rounded-lg w-full`}>
      {steamUser ? (
        <>
          {userOwnsApp ? (
            <div>
              <h2 className='text-secondary text-lg'>Submit Your Own Performance Post</h2>
              <Form
                method="post"
                name="performancePost"
                className="flex flex-col items-center gap-3 w-full max-w-lg"
              >
                <label className='w-full'>
                  <textarea
                    name="postText"
                    className="bg-primary rounded-lg p-2 w-full h-28"
                    defaultValue={actionData?.values.postText}
                  />
                </label>
                <label>
                  <SelectMenu
                    initialValue='None'
                    options={['None', 'Platinum', 'Gold', 'Silver', 'Borked']}
                    onChange={(e) => console.log(e)}
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
        </>
      ): (
        <div>
          You are not logged in. You must login to post a performance review for this app.
        </div>
      )}
    </div>
  );
}
