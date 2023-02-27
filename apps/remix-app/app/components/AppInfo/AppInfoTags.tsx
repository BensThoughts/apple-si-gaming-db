import TextPill from '~/components/TextPill';
import TailwindDisclosure from './TailwindDisclosure';

interface AppInfoTagsProps {
  genres: {
    id: string;
    description: string
  }[];
  categories: {
    id: number;
    description: string;
  }[];
}

export default function AppInfoTags({
  genres,
  categories,
}: AppInfoTagsProps) {
  return (
    <div className="w-full">
      <TailwindDisclosure title="Tags">
        <div className="flex flex-col gap-3">
          {genres.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              Genres:
              {genres.map((genre) => (
                <div key={genre.id}>
                  <TextPill className="bg-tertiary hover:bg-tertiary-highlight">
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
                <div key={category.id}>
                  <TextPill className="bg-tertiary hover:bg-tertiary-highlight">
                    {category.description}
                  </TextPill>
                </div>
              ))}
            </div>
          )}
        </div>
      </TailwindDisclosure>
    </div>
  );
}
