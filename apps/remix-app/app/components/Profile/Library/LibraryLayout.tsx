import Heading from '~/components/Heading';
import OwnedAppsLayout from './OwnedAppsLayout';
import SyncLibraryForm from './SyncLibraryForm';

interface LibraryLayoutProps {
  ownedApps: {
    steamAppId: number;
    name: string;
    headerImage?: string | null;
    genres: {
      id: string;
      description: string;
    }[];
    platformMac?: boolean | null;
  }[];
}

export default function LibraryLayout({
  ownedApps,
}: LibraryLayoutProps) {
  return (
    <div className="flex flex-col gap-8 items-center w-full p-4 bg-tertiary rounded-lg border-1 border-secondary-highlight">
      <Heading>Library</Heading>

      {/* <div className="flex flex-col items-center md:flex-row gap-2 md:items-start justify-between w-full">
        <Heading>Library</Heading>
      </div> */}
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
              re-sync library button or logout and back in.
            </div>
            <div>
              <SyncLibraryForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
