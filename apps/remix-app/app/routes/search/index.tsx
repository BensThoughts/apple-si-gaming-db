import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useTransition } from '@remix-run/react';
import { searchReleasedSteamAppsByName } from '~/models/steamApp.server';
import { useMediaIsWide } from '~/lib/hooks/useMedia';
import SearchTitleCard from '~/components/Search/SearchTitleCard';
import LoadingComponent from '~/components/LoadingComponent';
import SearchInputForm from '~/components/Search/SearchInputForm';
import RoundedLink from '~/components/RoundedLink';
import { metaTags } from '~/lib/meta-tags';
import type { MultiSelectOption } from '~/components/FormComponents/MultiSelectMenu';
import { findAllCategories } from '~/models/steamCategory.server';
import { findAllGenres } from '~/models/steamGenre.server';

function validateSearchQuery(searchQuery: string) {
  if (searchQuery.length > 100) {
    return `The search query is too long (100 character maximum)`;
  }
  // if (searchQuery.length < 2) {
  //   return `Search query must contain at least 2 character`;
  // }
}

export type LoaderData = {
  searchResults?: {
    steamApps: {
      name: string;
      steamAppId: number;
      headerImage: string | null;
      releaseDate: string | null;
    }[];
    page: number;
    hasNextPage: boolean;
  }
  searchOptions: {
    genreOptions: MultiSelectOption[];
    categoryOptions: MultiSelectOption[];
  }
  formError?: string;
  fieldErrors?: {
    searchQuery?: string | undefined;
  };
  fields?: {
    searchQuery: string;
  };
};

const badRequest = (data: LoaderData) => json<LoaderData>(data, { status: 400 });

export async function loader({
  request,
}: LoaderArgs) {
  const genreOptions: MultiSelectOption[] =
    (await findAllGenres())
        .map((genre) => ({
          label: genre.description,
          value: genre.genreId,
        }));
  const categoryOptions: MultiSelectOption[] =
      (await findAllCategories())
          .map((category) => ({
            label: category.description,
            value: category.categoryId,
          }));
  const searchOptions = { genreOptions, categoryOptions };

  const url = new URL(request.url);

  const searchQuery = url.searchParams.get('searchQuery')?.trim();

  // !This is the case where someone navigates to /search initially
  // !with no searchQuery
  if (
    (searchQuery === undefined) ||
    (searchQuery === null)
  ) {
    return json<LoaderData>({ searchOptions, fields: { searchQuery: '' } });
  }
  const pageQuery = url.searchParams.get('page')?.trim() || 1;
  const searchAppleOnly = url.searchParams.get('searchAppleOnly');
  const searchGenreIds = url.searchParams.getAll('searchGenreIds');
  const searchCategoryIds = url.searchParams.getAll('searchCategoryIds');
  let genreIds: string[] | undefined = undefined;
  let categoryIds: number[] | undefined = undefined;

  if (searchGenreIds[0] !== '' && searchGenreIds.length > 0) {
    genreIds = searchGenreIds;
  }
  if (searchCategoryIds[0] !== '' && searchCategoryIds.length > 0) {
    categoryIds = searchCategoryIds.map((categoryId) => Number(categoryId));
  }

  let platformMac: boolean | undefined = undefined;
  if (
    typeof searchAppleOnly === 'string' &&
    searchAppleOnly === 'on'
  ) {
    platformMac = true;
  }

  let page = 1;
  page = Number(pageQuery);
  if (!isFinite(page)) {
    return badRequest( {
      searchOptions,
      formError: `Page must be a positive finite number`,
    });
  }
  if (page < 1) {
    return badRequest( {
      searchOptions,
      formError: `Page must be a positive number, greater than zero`,
    });
  }

  if (typeof searchQuery !== 'string') {
    return badRequest({
      searchOptions,
      formError: `Search form not submitted correctly.`,
    });
  }
  const fieldErrors = {
    searchQuery: validateSearchQuery(searchQuery),
  };
  const fields = { searchQuery };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ searchOptions, fieldErrors, fields });
  }

  const PAGE_SIZE = 50;
  const skip = PAGE_SIZE * (page - 1);
  const take = PAGE_SIZE + 1; // take 1 extra to see if there is a next page
  const steamAppsAll =
    await searchReleasedSteamAppsByName({
      searchQuery,
      skip,
      take,
      whereOptions: {
        platformMac,
        genreIds,
        categoryIds,
      },
    });
  let hasNextPage = false;
  if (steamAppsAll.length >= PAGE_SIZE) {
    hasNextPage = true;
  }
  const steamApps = steamAppsAll.slice(0, PAGE_SIZE);
  const searchResults = {
    steamApps,
    page,
    hasNextPage,
  };
  return json<LoaderData>({ searchOptions, searchResults, fields });
}

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  if (data.fields?.searchQuery) {
    return {
      'title': `${metaTags.title} - Search - ${data.fields.searchQuery}`,
    };
  }
  return {
    'title': `${metaTags.title} - Search`,
  };
};

function SearchIndexWrap({
  searchOptions,
  children,
  formError,
  fieldErrors,
  isSubmitting,
}: {
  searchOptions: {
    genreOptions: MultiSelectOption[];
    categoryOptions: MultiSelectOption[];
  }
  isSubmitting: boolean;
  children?: React.ReactNode;
  formError?: string;
  fieldErrors?: {
    searchQuery?: string | undefined;
  };
}) {
  const { isWide } = useMediaIsWide();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full md:min-w-[546px] h-full items-center justify-center
                      bg-tertiary rounded-lg border-1 border-secondary-highlight p-10">
        <SearchInputForm
          genreOptions={searchOptions.genreOptions}
          categoryOptions={searchOptions.categoryOptions}
          isSubmitting={isSubmitting}
          componentSize={isWide ? 'large' : 'small'}
          formError={formError}
          fieldErrors={fieldErrors}
        />
      </div>
      {children &&
        <div>
          {children}
        </div>
      }
    </div>
  );
}

export default function SearchIndexRoute() {
  const { searchResults, searchOptions, fields, fieldErrors, formError } = useLoaderData<LoaderData>();
  const steamApps = searchResults?.steamApps;
  const hasNextPage = searchResults?.hasNextPage;
  const page = searchResults?.page ? searchResults.page : 1;
  const searchQuery = fields?.searchQuery ? fields.searchQuery : '';

  const transition = useTransition();
  const isSubmitting = (
    (transition.state === 'submitting') &&
    (transition.location.pathname === '/search')
  );

  if (isSubmitting) {
    return (
      <SearchIndexWrap
        searchOptions={searchOptions}
        formError={formError}
        fieldErrors={fieldErrors}
        isSubmitting
      >
        <LoadingComponent />
      </SearchIndexWrap>
    );
  }

  if (
    (searchQuery.length > 0) &&
    (steamApps) &&
    (steamApps.length < 1)
  ) {
    return (
      <SearchIndexWrap
        searchOptions={searchOptions}
        formError={formError}
        fieldErrors={fieldErrors}
        isSubmitting={isSubmitting}
      >
        <div className="w-full flex items-center justify-center bg-tertiary
                        border-1 border-secondary-highlight rounded-md p-4">
          No apps found for&nbsp;
          <i className="italic text-secondary">
            {searchQuery}
          </i>
        </div>
      </SearchIndexWrap>
    );
  }

  // !This is the case where someone navigates to /search initially
  // !with no searchQuery
  if (!steamApps) {
    return (
      <SearchIndexWrap
        searchOptions={searchOptions}
        formError={formError}
        fieldErrors={fieldErrors}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <SearchIndexWrap
      searchOptions={searchOptions}
      formError={formError}
      fieldErrors={fieldErrors}
      isSubmitting={isSubmitting}
    >
      <div className="flex flex-col gap-3 items-center w-full border-secondary border-1 rounded-md p-4 bg-app-bg">
        {steamApps.map(({ steamAppId, name, headerImage, releaseDate }) => (
          <div key={steamAppId}>
            <SearchTitleCard
              name={name}
              steamAppId={steamAppId}
              headerImageSrc={headerImage}
              releaseDate={releaseDate}
            />
          </div>
        ))}
        {(hasNextPage || (page > 1)) &&
          <div className="flex justify-between w-full">
            {page > 1 &&
              <RoundedLink
                to={`/search?searchQuery=${searchQuery}&page=${page - 1}`}
              >
                Previous Page
              </RoundedLink>
            }
            {hasNextPage &&
              <RoundedLink
                to={`/search?searchQuery=${searchQuery}&page=${page + 1}`}
                className="ml-auto"
              >
                Next Page
              </RoundedLink>
            }
          </div>
        }
      </div>
    </SearchIndexWrap>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>Error in /search/index route</h1>
      <div>{error.message}</div>
    </div>
  );
}
