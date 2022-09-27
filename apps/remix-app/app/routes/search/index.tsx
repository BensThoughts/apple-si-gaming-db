import type { LoaderArgs } from '@remix-run/server-runtime';
import { json } from '@remix-run/node';
import { useLoaderData, useTransition } from '@remix-run/react';
import { searchReleasedSteamAppsByName } from '~/models/steamApp.server';
import { useMediaIsWide } from '~/lib/hooks/useMedia';
import SearchTitleCard from '~/components/Cards/SearchTitleCard';
import LoadingComponent from '~/components/LoadingComponent';
import SearchInput from '~/components/FormComponents/SearchInput';


function validateSearchQuery(searchQuery: string) {
  if (searchQuery.length > 100) {
    return `The search query is too long (100 character maximum)`;
  }
  if (searchQuery.length < 1) {
    return `Search query must contain at least 1 character`;
  }
}

export type LoaderData = {
  steamApps?: {
    name: string;
    steamAppId: number;
    headerImage: string | null;
    releaseDate: string | null;
  }[] | null;
  formError?: string;
  fieldErrors?: {
    searchQuery?: string | undefined;
  };
  fields?: {
    searchQuery: string;
  };
};

const badRequest = (data: LoaderData) => json(data, { status: 400 });

export async function loader({
  request,
}: LoaderArgs) {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get('searchQuery')?.trim();

  // This is the case where someone navigates to /search initially
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

  const steamApps = await searchReleasedSteamAppsByName(searchQuery);
  return json({ steamApps, fields });
}

export default function SearchIndexRoute() {
  const { isWide } = useMediaIsWide();
  const { steamApps, fields, fieldErrors } = useLoaderData<LoaderData>();
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
