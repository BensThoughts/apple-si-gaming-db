import { Fragment, useMemo, useState } from 'react';
import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import ToggleSwitch from '~/components/FormComponents/ToggleSwitch';
import MaterialInputOutlined from '~/components/FormComponents/MaterialInputOutlined';
import RoundedButton from '~/components/Buttons/RoundedButton';
import SmallAppDisplayCard from './SmallAppDisplayCard';
import type { SteamAppForSmallAppsGridLayout } from '~/types';

function computeGenreOptions(ownedApps: SteamAppForSmallAppsGridLayout[], ALL_FILTER: SelectOption) {
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

export default function SmallAppsGridLayout({
  steamApps,
}: {
  steamApps: SteamAppForSmallAppsGridLayout[]
}) {
  const APPS_PER_PAGE = 30;
  const ALL_FILTER = useMemo(() => ({ name: 'All', value: 'All' }), []);
  const genreOptions = useMemo(() => computeGenreOptions(steamApps, ALL_FILTER), [steamApps, ALL_FILTER]);
  const [nameQuery, setNameQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState(ALL_FILTER);
  const [filterAppleOnly, setFilterAppleOnly] = useState(false);
  const [paginate, setPaginate] = useState(APPS_PER_PAGE);

  const loadMore = () => {
    setPaginate((prevValue) => prevValue + APPS_PER_PAGE);
  };

  function searchNames(appsWithPosts: SteamAppForSmallAppsGridLayout[]) {
    return appsWithPosts.filter(
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

  const filteredSteamApps = searchNames(steamApps);
  const paginatedSteamApps = filteredSteamApps.slice(0, paginate);
  const lastPage = paginate >= filteredSteamApps.length;

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className="self-center flex flex-col xl:flex-row items-center justify-center gap-3
                   bg-tertiary p-4 rounded-lg"
      >
        <div>
          <MaterialInputOutlined
            id="profileSearch"
            name="profileSearch"
            label="Search by name..."
            componentSize="large"
            aria-label="Search games by name"
            onChange={(e) => setNameQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-2">
          <label>Apple:</label>
          <ToggleSwitch checked={filterAppleOnly} onChange={setFilterAppleOnly} />
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-2">
          <label>Genre:</label>
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

        <div className="flex flex-wrap justify-center items-center gap-3">
          {paginatedSteamApps.map(({
            steamAppId,
            name,
            headerImage,
          }) => (
            <Fragment key={steamAppId}>
              <SmallAppDisplayCard
                steamAppId={steamAppId}
                name={name}
                headerImgSrc={headerImage}
              />
            </Fragment>
          ))}
        </div>
        {!lastPage && <RoundedButton width="wide" onClick={() => loadMore()}>Load More...</RoundedButton>}
      </div>
    </div>
  );
}
