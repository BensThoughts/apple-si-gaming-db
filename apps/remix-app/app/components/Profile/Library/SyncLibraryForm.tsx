import { useFetcher } from '@remix-run/react';
import { useEffect } from 'react';
import { SyncOutlineIcon } from '~/components/Icons/FlatIcons/Outline';
import RoundedButton from '~/components/Buttons/RoundedButton';
import { showToast } from '~/components/Toasts';
import type { LibraryActionData } from '~/routes/profile/library';

export default function SyncLibraryForm() {
  const fetcher = useFetcher<LibraryActionData>();
  useEffect(() => {
    if (
      fetcher.formAction === '/profile/library' &&
      fetcher.data
    ) {
      const { updateOwnedGames: { success } } = fetcher.data;
      if (!success) {
        showToast.error('Error updating library, is your steam profile set to public?');
      }
    }
  }, [fetcher]);

  const isSubmitting =
    fetcher.state != 'idle' &&
    fetcher.formAction === '/profile/library';

  return (
    <div
      className="flex items-center justify-center gap-3
                 bg-tertiary p-4 rounded-lg border-1 border-secondary-highlight"
    >
      <div>
        <SyncOutlineIcon size={38} className="fill-secondary-highlight stroke-1" />
      </div>
      <div>
        <fetcher.Form
          action="/profile/library"
          method="post"
        >
          <input type="hidden" name="_profileAction" value="updateOwnedGames" />
          <RoundedButton
            width="wide"
            type="submit"
            className="focus:outline-none focus-visible:show-ring-tertiary"
            disabled={fetcher.state != 'idle'}
          >
            {isSubmitting ? <span>Updating...</span> : <span>Resync Library</span>}
          </RoundedButton>
        </fetcher.Form>
      </div>
    </div>
  );
}
