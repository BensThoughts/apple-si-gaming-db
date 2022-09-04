import type { PrismaSteamCategory } from '~/interfaces';
import TextPill from '~/components/TextPill';
import AppInfoDisclosure from './AppInfoDisclosure';

export default function AppInfoCategories({
  categories,
}: {
  categories: PrismaSteamCategory[]
}) {
  return (
    <AppInfoDisclosure title="Categories">
      <div className="flex gap-2 flex-wrap">
        <>
          {categories.map((category) => (
            <div key={category.categoryId}>
              <TextPill>
                {category.description}
              </TextPill>
            </div>
          ))}
        </>
      </div>
    </AppInfoDisclosure>
  );
};
