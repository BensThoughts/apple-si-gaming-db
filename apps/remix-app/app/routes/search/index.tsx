import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useCatch, useLoaderData, useTransition } from '@remix-run/react';
import { searchReleasedSteamAppsByName } from '~/models/steamApp.server';
import SearchTitleCard from '~/components/Search/SearchTitleCard';
import LoadingComponent from '~/components/LoadingComponent';
import SearchForm from '~/components/Search/SearchForm';
import RemixRoundedLink from '~/components/RemixRoundedLink';
import { metaTags } from '~/lib/meta-tags';
import type { MultiSelectOption } from '~/components/FormComponents/MultiSelectMenu';
import { getSearchOptions } from '~/lib/loader-functions/search.server';
import { Fragment } from 'react';

function validateSearchQuery(searchQuery: string) {
  if (searchQuery.length > 100) {
    return `The search query is too long (100 character maximum)`;
  }
  // if (searchQuery.length < 2) {
  //   return `Search query must contain at least 2 character`;
  // }
}

function validateGenreIds(
    genreIds: string[],
    validGenres: GenreSelectOptions,
) {
  let invalidGenreId: string | undefined;

  const hasInvalidGenreId = genreIds.some((genreId) => {
    const isValidCategoryId =
      validGenres.some((genre) => genre.value === genreId);
    if (!isValidCategoryId) {
      invalidGenreId = genreId;
      return true;
    }
    return false;
  });
  if (hasInvalidGenreId) {
    return `Genre Id ${invalidGenreId} was not a valid option`;
  }
}

function validateCategoryIds(
    categoryIds: number[],
    validCategoryOptions: CategorySelectOptions,
) {
  let invalidCategoryId: number | undefined;

  const hasInvalidCategoryId = categoryIds.some((categoryId) => {
    const isValidCategoryId =
      validCategoryOptions
          .some((categoryOption) => categoryOption.value === categoryId);

    if (!isValidCategoryId) {
      invalidCategoryId = categoryId;
      return true;
    }
    return false;
  });
  if (hasInvalidCategoryId) {
    return `Category Id ${invalidCategoryId} was not a valid option`;
  }
}

export interface SearchFormFields {
  searchQuery: string;
  searchAppleOnly: boolean;
  searchGenreIds?: string[];
  searchCategoryIds?: number[];
}

export interface SearchFormFieldErrors {
  searchQuery?: string | undefined;
  searchGenreIds?: string | undefined;
  searchCategoryIds?: string | undefined;
}

interface SearchFormState {
  formError?: string;
  fieldErrors?: SearchFormFieldErrors;
  fields?: SearchFormFields;
}

type GenreSelectOptions = MultiSelectOption<string>[];
type CategorySelectOptions = MultiSelectOption<number>[];
// export interface SearchPageLoaderDataSearchOptions {
//   genreOptions: GenreSelectOptions;
//   categoryOptions: CategorySelectOptions;
// }

export type SearchPageLoaderData = {
  searchOptions: {
    genreOptions: GenreSelectOptions;
    categoryOptions: CategorySelectOptions;
  };
  searchFormState?: SearchFormState;
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
};

const badRequest = (data: SearchPageLoaderData) => json<SearchPageLoaderData>(data, { status: 400 });


export async function loader({
  request,
}: LoaderArgs) {
  const searchOptions = await getSearchOptions();

  const url = new URL(request.url);
  const searchQuery = url.searchParams.get('searchQuery')?.trim();
  // !This is the case where someone navigates to /search initially
  // !with no searchQuery
  if (
    (searchQuery === undefined) ||
    (searchQuery === null)
  ) {
    return json<SearchPageLoaderData>({ searchOptions });
  }
  // If searchQuery exists we extract all other data
  const pageQuery = url.searchParams.get('page')?.trim() || '1';
  const searchAppleOnly = url.searchParams.get('searchAppleOnly');
  const searchGenreIds = url.searchParams.getAll('searchGenreIds');
  const searchCategoryIds = url.searchParams.getAll('searchCategoryIds');

  // page falls under formError because it has no field representing it
  const page = Number(pageQuery);
  if (!isFinite(page)) {
    return badRequest( {
      searchOptions,
      searchFormState: {
        formError: `Page must be a positive finite number`,
      },
    });
  }
  if (page < 1) {
    return badRequest( {
      searchOptions,
      searchFormState: {
        formError: `Page must be a positive number, greater than zero`,
      },
    });
  }

  let genreIds: string[] = [];
  let categoryIds: number[] = [];
  if (searchGenreIds[0] !== '' && searchGenreIds.length > 0) {
    genreIds = searchGenreIds;
  }
  if (searchCategoryIds[0] !== '' && searchCategoryIds.length > 0) {
    categoryIds = searchCategoryIds.map((categoryId) => Number(categoryId));
  }

  const fieldErrors = {
    searchQuery: validateSearchQuery(searchQuery),
    searchCategoryIds: validateCategoryIds(categoryIds, searchOptions.categoryOptions),
    searchGenreIds: validateGenreIds(genreIds, searchOptions.genreOptions),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      searchOptions,
      searchFormState: {
        fieldErrors,
        fields: {
          searchQuery,
          searchAppleOnly: searchAppleOnly ? true : false,
        },
      },
    });
  }

  const fields = {
    searchQuery,
    searchGenreIds: genreIds,
    searchCategoryIds: categoryIds,
    searchAppleOnly: searchAppleOnly ? true : false,
  };


  const PAGE_SIZE = 50;
  const skip = PAGE_SIZE * (page - 1);
  const take = PAGE_SIZE + 1; // take 1 extra to see if there is a next page
  const steamAppsAll =
    await searchReleasedSteamAppsByName({
      searchQuery,
      skip,
      take,
      whereOptions: {
        platformMac: searchAppleOnly ? true : undefined,
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
  return json<SearchPageLoaderData>({
    searchOptions,
    searchResults,
    searchFormState: {
      fields,
    },
  });
}

export const meta: MetaFunction = ({ data }: { data: SearchPageLoaderData }) => {
  if (data.searchFormState?.fields?.searchQuery) {
    return {
      'title': `${metaTags.title} - Search - ${data.searchFormState.fields.searchQuery}`,
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
  fields,
  isSubmitting,
}: {
  searchOptions: {
    genreOptions: GenreSelectOptions;
    categoryOptions: CategorySelectOptions;
  };
  isSubmitting: boolean;
  formError?: string;
  fieldErrors?: SearchFormFieldErrors;
  fields?: SearchFormFields;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 justify-center items-center w-full">
      <SearchForm
        genreOptions={searchOptions.genreOptions}
        categoryOptions={searchOptions.categoryOptions}
        isSubmitting={isSubmitting}
        formError={formError}
        fieldErrors={fieldErrors}
        fields={fields}
      />
      {children &&
        <div className="flex items-center justify-center w-full">
          {children}
        </div>
      }
    </div>
  );
}

export default function SearchIndexRoute() {
  const { searchResults, searchOptions, searchFormState } = useLoaderData<SearchPageLoaderData>();
  const steamApps = searchResults?.steamApps;
  const hasNextPage = searchResults?.hasNextPage;
  const page = searchResults?.page ? searchResults.page : 1;
  const {
    fields,
    formError,
    fieldErrors,
  } = searchFormState
    ? searchFormState
    : { fields: undefined, formError: undefined, fieldErrors: undefined };

  const {
    searchQuery,
    searchAppleOnly,
    searchCategoryIds,
    searchGenreIds,
  } = fields ? fields : {
    searchQuery: undefined,
    searchAppleOnly: undefined,
    searchCategoryIds: undefined,
    searchGenreIds: undefined,
  };

  const transition = useTransition();
  const isSubmitting = (
    (transition.state === 'submitting') &&
    (transition.location.pathname === '/search')
  );

  if (isSubmitting) {
    const newSearchQuery = transition.submission.formData.get('searchQuery');
    return (
      <SearchIndexWrap
        searchOptions={searchOptions}
        formError={formError}
        fieldErrors={fieldErrors}
        fields={fields ? {
          ...fields,
          searchQuery: newSearchQuery ? newSearchQuery.toString() : '',
        } : undefined}
        isSubmitting
      >
        <LoadingComponent />
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
        fields={fields}
        isSubmitting={isSubmitting}
      />
    );
  }

  if (
    (steamApps) &&
    (steamApps.length < 1)
  ) {
    return (
      <SearchIndexWrap
        searchOptions={searchOptions}
        formError={formError}
        fieldErrors={fieldErrors}
        fields={fields}
        isSubmitting={isSubmitting}
      >
        <div className="w-full max-w-xl flex items-center justify-center bg-tertiary
                        border-1 border-secondary-highlight rounded-md p-4">
          No apps found!
        </div>
      </SearchIndexWrap>
    );
  }

  const searchParams = new URLSearchParams();
  // !searchQuery must always be defined or the route
  // !will think this is an initial navigation to /search
  if (searchQuery) {
    searchParams.set('searchQuery', searchQuery);
  } else {
    searchParams.set('searchQuery', '');
  }
  if (searchAppleOnly) {
    searchParams.set('searchAppleOnly', 'on');
  }
  if (searchCategoryIds) {
    searchCategoryIds.forEach((categoryId) => {
      searchParams.append('searchCategoryIds', `${categoryId}`);
    });
  }
  if (searchGenreIds) {
    searchGenreIds.forEach((genreId) => {
      searchParams.append('searchGenreIds', genreId);
    });
  }

  return (
    <SearchIndexWrap
      searchOptions={searchOptions}
      formError={formError}
      fieldErrors={fieldErrors}
      fields={fields}
      isSubmitting={isSubmitting}
    >
      <div className="flex flex-col gap-3 items-center w-full max-w-xl border-secondary border-1 rounded-md p-4 bg-app-bg">
        {steamApps.map(({ steamAppId, name, headerImage, releaseDate }) => (
          <Fragment key={steamAppId}>
            <SearchTitleCard
              name={name}
              steamAppId={steamAppId}
              headerImageSrc={headerImage}
              releaseDate={releaseDate}
            />
          </Fragment>
        ))}
        {(hasNextPage || (page > 1)) &&
          <div className="flex justify-between w-full">
            {page > 1 &&
              <RemixRoundedLink
                to={`/search?page=${page - 1}&` + searchParams.toString()}
              >
                Previous Page
              </RemixRoundedLink>
            }
            {hasNextPage &&
              <RemixRoundedLink
                to={`/search?page=${page + 1}&` + searchParams.toString()}
                className="ml-auto"
              >
                Next Page
              </RemixRoundedLink>
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

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div>
      <h1>Oops! - {caught.status} - {caught.data}</h1>
      <p>Error in /search/index route</p>
    </div>
  );
}
