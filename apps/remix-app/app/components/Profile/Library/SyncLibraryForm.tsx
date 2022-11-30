import { Form } from '@remix-run/react';
import { SyncOutlineIcon } from '~/components/Icons/FlatIcons';
import RoundedButton from '~/components/RoundedButton';

export default function SyncLibraryForm({
  isSubmittingUpdateGames,
}: {
  isSubmittingUpdateGames: boolean;
}) {
  return (
    <div
      className="flex flex-col md:flex-row items-center justify-center gap-3
               bg-tertiary p-4 rounded-lg border-1 border-secondary-highlight"
    >
      <div>
        <SyncOutlineIcon size={38} className="text-icon-secondary-highlight" />
      </div>
      <div>
        <Form
          action="/profile/library"
          method="post"
        >
          <input type="hidden" name="_profileAction" value="updateOwnedGames" />
          <RoundedButton type="submit">
            {isSubmittingUpdateGames ? <span>Updating...</span> : <span>Resync Library</span>}
          </RoundedButton>
        </Form>
      </div>
    </div>
  );
}
