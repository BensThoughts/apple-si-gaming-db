import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useCatch, useLoaderData, useNavigation } from '@remix-run/react';
import { searchReleasedSteamAppsByName } from '~/models/Steam/steamApp.server';
import SearchTitleCard from '~/components/Search/SearchTitleCard';
import LoadingComponent from '~/components/LoadingComponent';
import SearchForm from '~/components/Search/SearchForm';
import RoundedButtonRemixLink from '~/components/Buttons/RoundedButtonRemixLink';
import { metaTags } from '~/lib/meta-tags';
import type { MultiSelectOption } from '~/components/FormComponents/MultiSelectMenu';
import { getSearchOptions } from '~/lib/loader-functions/search.server';
import { Fragment } from 'react';
import ErrorDisplay from '~/components/Layout/ErrorDisplay';
import CatchDisplay from '~/components/Layout/CatchDisplay';
import type { SteamAppForSearchPage } from '~/types';
import {
  validateAppName,
  validateGenreIds,
  validateCategoryIds,
  validatePageNumber,
} from '~/lib/form-validators/search';
import { SearchFormURLParams } from '~/lib/enums/URLSearchParams/Search';

export type SearchFormState = {
  formError?: string;
  fieldErrors?: {
    appName?: string | undefined;
    genreIds?: string | undefined;
    categoryIds?: string | undefined;
  };
  fields?: {
    appName: string;
    appleOnly: boolean;
    genreIds?: string[];
    categoryIds?: number[];
  }
  // fields?: SearchFormFields;
}

type GenreSelectOptions = MultiSelectOption<string>[];
type CategorySelectOptions = MultiSelectOption<number>[];

export type SearchPageLoaderData = {
  availableSearchOptions: {
    genreOptions: GenreSelectOptions;
    categoryOptions: CategorySelectOptions;
  };
  searchFormState?: SearchFormState;
  searchResults?: {
    steamApps: SteamAppForSearchPage[];
    page: number;
    hasNextPage: boolean;
  }
};

const badRequest = (data: SearchPageLoaderData) => json<SearchPageLoaderData>(data, { status: 400 });


export async function loader({
  request,
}: LoaderArgs) {
  const availableSearchOptions = await getSearchOptions();

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const appName = searchParams.get(SearchFormURLParams.APP_NAME)?.trim();
  // !This is the case where someone navigates to /search initially
  // !with no appName in the searchQuery
  if (
    (appName === undefined) ||
    (appName === null)
  ) {
    return json<SearchPageLoaderData>({ availableSearchOptions });
  }
  // If searchQuery exists we extract all other data
  const pageParam = searchParams.get(SearchFormURLParams.PAGE)?.trim() || '1';
  const page = Number(pageParam);
  // page falls under formError because it has no field in the form representing it
  const formError = validatePageNumber(page);
  if (formError) {
    throw new Response(formError, { status: 400 });
    // return badRequest({ availableSearchOptions, searchFormState: { formError } });
  }
  const appleOnlyParam = searchParams.get(SearchFormURLParams.APPLE_ONLY);
  const appleOnly = appleOnlyParam ? true : false;
  const genreIdParams = searchParams.getAll(SearchFormURLParams.GENRE_IDS);
  let genreIds: string[] = [];
  if (genreIdParams[0] !== '' && genreIdParams.length > 0) {
    genreIds = genreIdParams;
  }
  const categoryIdParams = searchParams.getAll(SearchFormURLParams.CATEGORY_IDS);
  let categoryIds: number[] = [];
  if (categoryIdParams[0] !== '' && categoryIdParams.length > 0) {
    categoryIds = categoryIdParams.map((categoryId) => Number(categoryId));
  }

  const validGenreIds = availableSearchOptions.genreOptions.map((genre) => genre.value);
  const validCategoryIds = availableSearchOptions.categoryOptions.map((category) => category.value);

  const fieldErrors = {
    appName: validateAppName(appName),
    genreIds: validateGenreIds(genreIds, validGenreIds),
    categoryIds: validateCategoryIds(categoryIds, validCategoryIds),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      availableSearchOptions,
      searchFormState: {
        fieldErrors,
        fields: {
          appName: fieldErrors.appName ? '' : appName,
          appleOnly,
          genreIds: fieldErrors.genreIds ? undefined : genreIds,
          categoryIds: fieldErrors.categoryIds ? undefined : categoryIds,
        },
      },
    });
  }

  const PAGE_SIZE = 25;
  const skip = PAGE_SIZE * (page - 1);
  const take = PAGE_SIZE + 1; // take 1 extra to see if there is a next page
  const steamAppsAll = await searchReleasedSteamAppsByName({
    appName,
    skip,
    take,
    whereOptions: {
      platformMac: appleOnly ? true : undefined,
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
    availableSearchOptions,
    searchResults,
    searchFormState: {
      fields: {
        appName,
        appleOnly,
        genreIds,
        categoryIds,
      },
    },
  });
}

export const meta: MetaFunction = ({ data }: { data?: Partial<SearchPageLoaderData> }) => {
  if (data?.searchFormState?.fields?.appName) {
    return {
      'title': `${metaTags.title} - Search - ${data.searchFormState.fields.appName}`,
    };
  }
  return {
    'title': `${metaTags.title} - Search`,
  };
};

function PageButtons({
  hasNextPage,
  page,
  searchParams,
}: {
  hasNextPage: boolean;
  page: number;
  searchParams: URLSearchParams;
}) {
  const nextPageSearchParams = new URLSearchParams(searchParams);
  nextPageSearchParams.set(SearchFormURLParams.PAGE, (page + 1).toString());
  const prevPageSearchParams = new URLSearchParams(searchParams);
  prevPageSearchParams.set(SearchFormURLParams.PAGE, (page - 1).toString());
  return (
    <div className="flex justify-between w-full">
      {page > 1 &&
        <RoundedButtonRemixLink
          to={`/search?${prevPageSearchParams.toString()}`}
          className="w-32"
        >
          Previous Page
        </RoundedButtonRemixLink>
      }
      {hasNextPage &&
        <RoundedButtonRemixLink
          to={`/search?${nextPageSearchParams.toString()}`}
          className="ml-auto w-32"
        >
          Next Page
        </RoundedButtonRemixLink>
      }
    </div>
  );
}

function SearchIndexWrap({
  availableSearchOptions,
  children,
  searchFormState,
  isSubmitting,
}: {
  availableSearchOptions: {
    genreOptions: GenreSelectOptions;
    categoryOptions: CategorySelectOptions;
  };
  isSubmitting: boolean;
  searchFormState?: SearchFormState;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 justify-center items-center w-full">
      <SearchForm
        genreOptions={availableSearchOptions.genreOptions}
        categoryOptions={availableSearchOptions.categoryOptions}
        isSubmitting={isSubmitting}
        formState={searchFormState}
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
  const { availableSearchOptions, searchFormState, searchResults } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  // !This is the case where someone navigates to /search initially
  // !with no searchQuery
  if (!searchFormState || !searchResults) {
    return <SearchIndexWrap availableSearchOptions={availableSearchOptions} isSubmitting={false} />;
  }
  const {
    steamApps,
    hasNextPage,
    page,
  } = searchResults;

  const isSubmitting =
    navigation.state === 'loading' &&
    navigation.location.pathname === '/search';

  if (isSubmitting) {
    return (
      <SearchIndexWrap
        availableSearchOptions={availableSearchOptions}
        searchFormState={searchFormState}
        isSubmitting
      >
        <LoadingComponent />
      </SearchIndexWrap>
    );
  }

  if (steamApps.length < 1) {
    return (
      <SearchIndexWrap
        availableSearchOptions={availableSearchOptions}
        searchFormState={searchFormState}
        isSubmitting={isSubmitting}
      >
        <div className="w-full max-w-xl flex items-center justify-center bg-tertiary
                        border-1 border-secondary-highlight rounded-md p-4">
          No apps found!
        </div>
      </SearchIndexWrap>
    );
  }

  const {
    appName,
    appleOnly,
    genreIds,
    categoryIds,
  } = searchFormState.fields ? searchFormState.fields : {
    appName: '',
    appleOnly: undefined,
    genreIds: undefined,
    categoryIds: undefined,
  };
  const searchParams = new URLSearchParams();
  searchParams.set(SearchFormURLParams.PAGE, page.toString());
  searchParams.set(SearchFormURLParams.APP_NAME, appName);
  if (appleOnly) {
    searchParams.set(SearchFormURLParams.APPLE_ONLY, 'On');
  }
  if (genreIds) {
    genreIds.forEach((genreId) => searchParams.append(SearchFormURLParams.GENRE_IDS, genreId));
  }
  if (categoryIds) {
    categoryIds.forEach((categoryId) => searchParams.append(SearchFormURLParams.CATEGORY_IDS, categoryId.toString()));
  }
  return (
    <SearchIndexWrap
      availableSearchOptions={availableSearchOptions}
      searchFormState={searchFormState}
      isSubmitting={isSubmitting}
    >
      <div className="flex flex-col gap-3 items-center w-full max-w-xl border-secondary border-1 rounded-md p-4 bg-app-bg">
        {(hasNextPage || (page > 1)) &&
          <PageButtons
            page={page}
            hasNextPage={hasNextPage}
            searchParams={searchParams}
          />
        }
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
          <PageButtons
            page={page}
            hasNextPage={hasNextPage}
            searchParams={searchParams}
          />
        }
      </div>
    </SearchIndexWrap>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorDisplay includePageWrapper={false} error={error} currentRoute="/search" />;
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <CatchDisplay includePageWrap={false} thrownResponse={caught} currentRoute="/search" />
  );
}
