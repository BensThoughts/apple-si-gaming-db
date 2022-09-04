import type { PrismaSteamGenre } from '~/interfaces';
import TextPill from '~/components/TextPill';
import AppInfoDisclosure from './AppInfoDisclosure';

export default function AppInfoGenres({
  genres,
}: {
  genres: PrismaSteamGenre[]
}) {
  return (
    <AppInfoDisclosure title="Genres">
      <div className="flex gap-2 flex-wrap">
        <>
          {genres.map((genre) => (
            <div key={genre.genreId}>
              <TextPill>
                {genre.description}
              </TextPill>
            </div>
          ))}
        </>
      </div>
    </AppInfoDisclosure>
  );
};
