import SmallAppsGridLayout from '~/components/SmallAppsGridLayout';
import type { SteamAppForSmallAppsGridLayout } from '~/types/remix-app';
import SyncLibraryForm from './SyncLibraryForm';

type LibraryLayoutProps = {
  ownedApps: SteamAppForSmallAppsGridLayout[];
}

export default function LibraryLayout({
  ownedApps,
}: LibraryLayoutProps) {
  return (
    <div className="flex flex-col gap-8 items-center w-full rounded-lg">
      {/* <div className="flex flex-col items-center md:flex-row gap-2 md:items-start justify-between w-full">
        <Heading>Library</Heading>
      </div> */}
      {(ownedApps && ownedApps.length > 0) ? (
        <div className="flex flex-col items-center justify-center self-center gap-8 w-full">
          <div className="">
            <SyncLibraryForm />
          </div>
          <div>
            <SmallAppsGridLayout steamApps={ownedApps} />
          </div>
        </div>
      ) : (
        <div className="max-w-md">
          <div
            className="flex flex-col gap-3 px-6 py-8 rounded-md bg-primary text-primary"
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
