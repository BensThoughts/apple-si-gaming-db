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

function validateSearchQuery(searchQuery: string) {
  if (searchQuery.length > 100) {
    return `The search query is too long (100 character maximum)`;
  }
  if (searchQuery.length < 2) {
    return `Search query must contain at least 2 character`;
  }
}

export type LoaderData = {
  pageData?: {
    steamApps: {
      name: string;
      steamAppId: number;
      headerImage: string | null;
      releaseDate: string | null;
    }[];
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
    return json<LoaderData>({ fields: { searchQuery: '' } });
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
  const skip = PAGE_SIZE * (page - 1);
  const take = PAGE_SIZE + 1; // take 1 extra to see if there is a next page
  const steamAppsAll = await searchReleasedSteamAppsByName(searchQuery, skip, take);
  let hasNextPage = false;
  if (steamAppsAll.length >= PAGE_SIZE) {
    hasNextPage = true;
  }
  const steamApps = steamAppsAll.slice(0, PAGE_SIZE);
  const pageData = {
    steamApps,
    page,
    hasNextPage,
  };
  return json<LoaderData>({ pageData, fields });
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
  children,
  formError,
  fieldErrors,
  isSubmitting,
}: {
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
          isSubmitting={isSubmitting}
          componentSize={isWide ? 'large' : 'medium'}
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
  const { pageData, fields, fieldErrors, formError } = useLoaderData<LoaderData>();
  const steamApps = pageData?.steamApps;
  const hasNextPage = pageData?.hasNextPage;
  const page = pageData?.page ? pageData.page : 1;
  const searchQuery = fields?.searchQuery ? fields.searchQuery : '';

  const transition = useTransition();
  const isSubmitting = (
    (transition.state === 'submitting') &&
    (transition.location.pathname === '/search')
  );

  if (isSubmitting) {
    return (
      <SearchIndexWrap
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

  if (!steamApps) {
    return (
      <SearchIndexWrap
        formError={formError}
        fieldErrors={fieldErrors}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <SearchIndexWrap
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
