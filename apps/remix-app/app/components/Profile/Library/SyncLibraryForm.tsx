import { useFetcher } from '@remix-run/react';
import { useEffect } from 'react';
import { SyncOutlineIcon } from '~/components/Icons/FlatIcons';
import RoundedButton from '~/components/RoundedButton';
import { showToast } from '~/components/Toasts';
import type { LibraryActionData } from '~/routes/profile/library';

export default function SyncLibraryForm() {
  const fetcher = useFetcher<LibraryActionData>();
  const actionData = fetcher.data;
  useEffect(() => {
    if (actionData) {
      const { updateOwnedGames: { success } } = actionData;
      if (!success) {
        showToast.error('Error updating library, is your steam profile set to public?');
      }
    }
  }, [actionData]);

  return (
    <div
      className="flex items-center justify-center gap-3
                 bg-tertiary p-4 rounded-lg border-1 border-secondary-highlight"
    >
      <div>
        <SyncOutlineIcon size={38} className="text-icon-secondary-highlight" />
      </div>
      <div>
        <fetcher.Form
          action="/profile/library"
          method="post"
        >
          <input type="hidden" name="_profileAction" value="updateOwnedGames" />
          <RoundedButton width="wide" type="submit" disabled={fetcher.state != 'idle'}>
            {fetcher.state != 'idle' ? <span>Updating...</span> : <span>Resync Library</span>}
          </RoundedButton>
        </fetcher.Form>
      </div>
    </div>
  );
}
