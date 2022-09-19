import type {
  SteamCategoryWithoutMetadata,
  SteamGenreWithoutMetadata } from '~/interfaces/database';
import TextPill from '~/components/TextPill';
import AppInfoDisclosure from './AppInfoDisclosure';

export default function AppInfoTags({
  genres,
  categories,
}: {
  genres: SteamGenreWithoutMetadata[],
  categories: SteamCategoryWithoutMetadata[],
}) {
  return (
    <AppInfoDisclosure title="Tags">
      <div className="flex flex-col gap-3">
        {genres.length > 0 && (
          <div className="flex gap-2 flex-wrap">
        Genres:
            {genres.map((genre) => (
              <div key={genre.genreId}>
                <TextPill>
                  {genre.description}
                </TextPill>
              </div>
            ))}
          </div>
        )}
        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap">
        Categories:
            {categories.map((category) => (
              <div key={category.categoryId}>
                <TextPill>
                  {category.description}
                </TextPill>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppInfoDisclosure>
  );
}
