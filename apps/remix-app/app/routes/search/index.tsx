import type { LoaderArgs } from '@remix-run/server-runtime';
import { json } from '@remix-run/node';
import { Link, useLoaderData, useTransition } from '@remix-run/react';
import { searchReleasedSteamAppsByName } from '~/models/steamApp.server';
import { useMediaIsWide } from '~/lib/hooks/useMedia';
import SearchTitleCard from '~/components/Cards/SearchTitleCard';
import LoadingComponent from '~/components/LoadingComponent';
import SearchInput from '~/components/FormComponents/SearchInput';
import RoundedButton from '~/components/RoundedButton';


function validateSearchQuery(searchQuery: string) {
  if (searchQuery.length > 100) {
    return `The search query is too long (100 character maximum)`;
  }
  if (searchQuery.length < 1) {
    return `Search query must contain at least 1 character`;
  }
}

export type LoaderData = {
  pageData?: {
    steamApps: {
      name: string;
      steamAppId: number;
      headerImage: string | null;
      releaseDate: string | null;
    }[] | null;
    page: number;
    hasNextPage: boolean;
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
  const url = new URL(request.url);

  const pageQuery = url.searchParams.get('page')?.trim() || 1;
  let page = 1;
  page = Number(pageQuery);
  if (!isFinite(page)) {
    return badRequest( { formError: `Page must be a positive finite number` });
  }
  if (page < 1) {
    return badRequest( { formError: `Page must be a positive number, greater than zero` });
  }

  const searchQuery = url.searchParams.get('searchQuery')?.trim();
  // !This is the case where someone navigates to /search initially
  // !with no searchQuery
  if (searchQuery === undefined) {
    return json({ steamApps: null, fields: { searchQuery: '' } });
  }
  if (typeof searchQuery !== 'string') {
    return badRequest({
      formError: `Search form not submitted correctly.`,
    });
  }
  const fieldErrors = {
    searchQuery: validateSearchQuery(searchQuery),
  };
  const fields = { searchQuery };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const PAGE_SIZE = 50;
  const steamApps = await searchReleasedSteamAppsByName(searchQuery, PAGE_SIZE, page);
  let hasNextPage = false;
  // TODO: could probably be steamApps.length === PAGE_SIZE
  // TODO: maybe some way to use nextPage data
  if (steamApps.length >= PAGE_SIZE) {
    const nextPageOfSteamApps = await searchReleasedSteamAppsByName(searchQuery, PAGE_SIZE, page + 1);
    if (nextPageOfSteamApps.length > 0) {
      hasNextPage = true;
    }
  }
  const pageData = {
    steamApps,
    page,
    hasNextPage,
  };
  return json<LoaderData>({ pageData, fields });
}

export default function SearchIndexRoute() {
  const { isWide } = useMediaIsWide();
  const { pageData, fields, fieldErrors } = useLoaderData<LoaderData>();

  const steamApps = pageData?.steamApps;
  const hasNextPage = pageData?.hasNextPage;
  const page = pageData?.page ? pageData.page : 1;
  const searchQuery = fields?.searchQuery ? fields.searchQuery : '';
  const transition = useTransition();

  const isLoadingSearchResults = (
    (transition.state === 'loading' && transition.location.pathname === '/search') ||
    (transition.state === 'submitting' && transition.location.pathname === '/search')
  ) ? true : false;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <SearchInput
          defaultValue={searchQuery}
          componentSize={isWide ? 'large' : 'medium'}
          fieldError={fieldErrors?.searchQuery}
          minLength={1}
          maxLength={100}
          required
        />
      </div>
      <div>
        {(isLoadingSearchResults ? <LoadingComponent /> : (
          <>
            {(steamApps && steamApps.length > 0) ? (
              <div className="flex flex-col gap-3 items-center w-full">
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
                      <Link to={`/search?searchQuery=${searchQuery}&page=${page - 1}`}>
                        <RoundedButton>
                          Previous Page
                        </RoundedButton>
                      </Link>
                    }
                    {hasNextPage &&
                      <Link
                        to={`/search?searchQuery=${searchQuery}&page=${page + 1}`}
                        className="ml-auto"
                      >
                        <RoundedButton>
                          Next Page
                        </RoundedButton>
                      </Link>
                    }
                  </div>
                }


              </div>
            ) : (
              <>
                {(searchQuery.length > 0) ? <div>No Apps Found</div> : null}
              </>
            )}
          </>
        ))}
      </div>
    </div>
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
