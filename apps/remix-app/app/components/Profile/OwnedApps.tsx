import { useState } from 'react';
import type {
  // SteamCategoryWithoutMetadata,
  SteamGenreWithoutMetadata,
} from '~/interfaces/database';
import SelectMenu from '../FormComponents/SelectMenu';
import ToggleSwitch from '../FormComponents/ToggleSwitch';
import FloatingLabelInput from '../FormComponents/SearchInput/FloatingLabelInput';
import OwnedAppDisplay from './OwnedAppDisplay';
import RoundedButton from '../RoundedButton';


interface OwnedApp {
    steamAppId: number;
    name: string;
    headerImage: string | null;
    platformMac: boolean | null;
    // categories: SteamCategoryWithoutMetadata[];
    genres: SteamGenreWithoutMetadata[];
}

export default function OwnedApps({
  ownedApps,
}: {
  ownedApps: OwnedApp[]
}) {
  const [nameQuery, setNameQuery] = useState('');
  const ALL_FILTER = 'All';
  const [genreFilter, setGenreFilter] = useState(ALL_FILTER);
  const [filterAppleOnly, setFilterAppleOnly] = useState(false);
  const [paginate, setPaginate] = useState(20);

  const loadMore = () => {
    setPaginate((prevValue) => prevValue + 20);
  };

  const genreSet = new Set<string>().add(ALL_FILTER);
  ownedApps.forEach((app) => {
    app.genres.forEach((genre) => genreSet.add(genre.description));
  });


  function searchNames(ownedApps: OwnedApp[]) {
    return ownedApps.filter(
        (app) =>
          (genreFilter != ALL_FILTER
          ? app.genres.map((genre) => genre.description).includes(genreFilter)
          : app) &&
          (filterAppleOnly
          ? app.platformMac
          : app) &&
          (app.name.toString().toLowerCase().includes(nameQuery.toLowerCase())))
        .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="flex flex-col md:flex-row items-center justify-center gap-3 w-full">
        <div>
          <FloatingLabelInput
            id="profileSearch"
            name="profileSearch"
            label="Search by name..."
            inputSize="large"
            aria-label="Search games by name"
            onChange={(e) => setNameQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2">
          <label>Apple:</label>
          <ToggleSwitch enabled={filterAppleOnly} onChange={setFilterAppleOnly} />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2">
          <label>Select Genre:</label>
          <SelectMenu
            options={[...genreSet]}
            onChange={(e) => setGenreFilter(e)}
            name="profileGenreFilter"
            // label="Select Genre"
            defaultValue={ALL_FILTER}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-1 w-full">
        {searchNames(ownedApps).slice(0, paginate).map(({
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
      <RoundedButton onClick={() => loadMore()}>Load More...</RoundedButton>
    </div>
  );
}
