import type { LoaderArgs } from '@remix-run/server-runtime';
import { json } from '@remix-run/node';
import { useLoaderData, useTransition } from '@remix-run/react';
import { searchReleasedSteamAppsByName } from '~/models/steamApp.server';
import SearchTitleCard from '~/components/Cards/SearchTitleCard';
import LoadingComponent from '~/components/LoadingComponent';

export async function loader({
  request,
}: LoaderArgs) {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get('searchQuery')?.trim();
  if (searchQuery && searchQuery != '') {
    const steamApps = await searchReleasedSteamAppsByName(searchQuery);
    return json({ steamApps });
  }
  return json({
    steamApps: null,
  });
}


export default function SearchIndexRoute() {
  const { steamApps } = useLoaderData<typeof loader>();
  const transition = useTransition();

  if (transition.state === 'loading' || transition.state === 'submitting') {
    return (
      <LoadingComponent />
    );
  }

  if (!steamApps) {
    return (
      <div>
        Search for an app!
      </div>
    );
  }
  return (
    <>
      {steamApps.length > 0
        ? (
          <div className="flex flex-col gap-3 items-center w-full">
            {steamApps.map(({ steamAppId, name, headerImage, releaseDate }) => (
              <div key={steamAppId} className="">
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
          <div>
            No Apps Found
          </div>
        )
      }
    </>
  );
}
