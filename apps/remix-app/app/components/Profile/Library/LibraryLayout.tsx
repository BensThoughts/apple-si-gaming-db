import RoundedButton from '~/components/RoundedButton';
import Heading from '~/components/Heading';
import { Form } from '@remix-run/react';
import OwnedAppsLayout from './OwnedAppsLayout';

interface LibraryLayoutProps {
  ownedApps: {
    steamAppId: number;
    name: string;
    headerImage?: string | null;
    genres: {
      genreId: string;
      description: string;
    }[];
    platformMac?: boolean | null;
  }[];
  isSubmittingUpdateGames: boolean;
}

export default function LibraryLayout({
  ownedApps,
  isSubmittingUpdateGames,
}: LibraryLayoutProps) {
  return (
    <div className="flex flex-col gap-8 items-center w-full p-4 bg-tertiary rounded-lg border-1 border-secondary-highlight">
      <Heading>Library</Heading>

      <div
        className="flex flex-col md:flex-row items-center justify-center gap-3
                   bg-tertiary p-4 rounded-lg border-1 border-secondary-highlight"
      >
        <div>
          Resync steam library
        </div>
        <div>
          <Form
            action="/profile/library"
            method="post"
          >
            <input type="hidden" name="_profileAction" value="updateOwnedGames" />
            <RoundedButton type="submit">
              {isSubmittingUpdateGames ? <span>Updating...</span> : <span>Update Library</span>}
            </RoundedButton>
          </Form>
        </div>
      </div>

      {(ownedApps && ownedApps.length > 0) ? (
      <div>
        <OwnedAppsLayout ownedApps={ownedApps} />
      </div>
    ) : (
      <div className="max-w-md">
        <div
          className="flex flex-col gap-3 px-6 py-8 border-1 border-secondary-highlight
                     rounded-md bg-primary text-primary"
        >
          <strong className="font-bold">No Apps Found</strong>
          <div>
            You are logged in but appear to have no apps owned. Is your Steam profile
            set to public?  Please set your steam profile to public and then use the
            update games button or logout and back in.
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
