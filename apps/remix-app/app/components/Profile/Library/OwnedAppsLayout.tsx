import { useMemo, useState } from 'react';
import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import ToggleSwitch from '~/components/FormComponents/ToggleSwitch';
import MaterialInput from '~/components/FormComponents/MaterialInput';
import OwnedAppDisplay from './OwnedAppDisplay';
import RoundedButton from '~/components/RoundedButton';
import SyncLibraryForm from './SyncLibraryForm';


interface OwnedApp {
  steamAppId: number;
  name: string;
  headerImage?: string | null;
  platformMac?: boolean | null;
  genres: {
    genreId: string;
    description: string;
  }[];
}

function computeGenreOptions(ownedApps: OwnedApp[], ALL_FILTER: SelectOption) {
  const genreSet = new Set<string>();
  ownedApps.forEach((app) => {
    app.genres.forEach((genre) => genreSet.add(genre.description));
  });
  const genreOptions: SelectOption[] =
    [...genreSet]
        .sort((a, b) => (a < b ? -1 : 0))
        .map((genre) => ({ name: genre, value: genre }));

  genreOptions.unshift(ALL_FILTER);

  return genreOptions;
}

export default function OwnedAppsLayout({
  ownedApps,
  isSubmittingUpdateGames,
}: {
  ownedApps: OwnedApp[]
  isSubmittingUpdateGames: boolean;
}) {
  const ALL_FILTER = useMemo(() => ({ name: 'All', value: 'All' }), []);
  const genreOptions = useMemo(() => computeGenreOptions(ownedApps, ALL_FILTER), [ownedApps, ALL_FILTER]);
  const [nameQuery, setNameQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState(ALL_FILTER);
  const [filterAppleOnly, setFilterAppleOnly] = useState(false);
  const [paginate, setPaginate] = useState(20);

  const loadMore = () => {
    setPaginate((prevValue) => prevValue + 20);
  };

  function searchNames(ownedApps: OwnedApp[]) {
    return ownedApps.filter(
        (app) =>
          (genreFilter.value != ALL_FILTER.value
          ? app.genres.map((genre) => genre.description).includes(genreFilter.value)
          : app) &&
          (filterAppleOnly
          ? app.platformMac
          : app) &&
          (app.name.toString().toLowerCase().includes(nameQuery.toLowerCase())))
        .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
  }

  const steamApps = searchNames(ownedApps);
  const paginatedSteamApps = steamApps.slice(0, paginate);
  const lastPage = paginate >= steamApps.length;

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className="self-center flex flex-col xl:flex-row items-center justify-center gap-3
                   bg-tertiary p-0 md:p-4 rounded-lg md:border-1 md:border-secondary-highlight"
      >
        <div>
          <MaterialInput
            id="profileSearch"
            name="profileSearch"
            label="Search by name..."
            componentSize="large"
            aria-label="Search games by name"
            onChange={(e) => setNameQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2">
          <label>Apple:</label>
          <ToggleSwitch checked={filterAppleOnly} onChange={setFilterAppleOnly} />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2">
          <label>Select Genre:</label>
          <SelectMenu
            options={genreOptions}
            onChange={(e) => setGenreFilter(e)}
            name="profileGenreFilter"
            // label="Select Genre"
            defaultValue={ALL_FILTER}
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center self-center gap-8 w-full">
        <div className="">
          <SyncLibraryForm isSubmittingUpdateGames={isSubmittingUpdateGames} />
        </div>


        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-1">
          {paginatedSteamApps.map(({
            steamAppId,
            name,
            headerImage,
          }) => (
            <div key={steamAppId}>
              <OwnedAppDisplay
                steamAppId={steamAppId}
                name={name}
                headerImgSrc={headerImage}
              />
            </div>
          ))}
        </div>
        {!lastPage && <RoundedButton onClick={() => loadMore()}>Load More...</RoundedButton>}
      </div>
    </div>
  );
}
