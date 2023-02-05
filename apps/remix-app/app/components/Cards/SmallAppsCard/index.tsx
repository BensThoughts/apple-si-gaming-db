import Heading from '~/components/Heading';
import SmallAppsLayout from './SmallAppsLayout';

export interface SteamAppForSmallDisplayCard {
  steamAppId: number;
  name: string;
  headerImage?: string | null;
  platformMac?: boolean | null;
  genres: {
    genreId: string;
    description: string;
  }[];
}

export default function SmallAppsCard({
  steamApps,
}: {
  steamApps: SteamAppForSmallDisplayCard[];
}) {
  return (
    <div className="flex flex-col gap-8 items-center w-full p-4 bg-tertiary rounded-lg border-1 border-secondary-highlight">
      <Heading>Games With Posts</Heading>

      {/* <div className="flex flex-col items-center md:flex-row gap-2 md:items-start justify-between w-full">
        <Heading>Library</Heading>
      </div> */}
      <div>
        <SmallAppsLayout steamApps={steamApps} />
      </div>
    </div>
  );
}
