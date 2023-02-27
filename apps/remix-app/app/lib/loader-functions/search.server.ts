import { findAllCategories } from '~/models/Steam/steamCategory.server';
import { findAllGenres } from '~/models/Steam/steamGenre.server';

export async function getSearchOptions() {
  const genres = await findAllGenres();
  const genreOptions = genres.map((genre) => ({
    label: genre.description,
    value: genre.id,
  }));
  const categories = await findAllCategories();
  const categoryOptions = categories.map((category) => ({
    label: category.description,
    value: category.id,
  }));
  return {
    genreOptions,
    categoryOptions,
  };
}
