import { findAllCategories } from '~/models/steamCategory.server';
import { findAllGenres } from '~/models/steamGenre.server';

export async function getSearchOptions() {
  const genres = await findAllGenres();
  const genreOptions = genres.map((genre) => ({
    label: genre.description,
    value: genre.genreId,
  }));
  const categories = await findAllCategories();
  const categoryOptions = categories.map((category) => ({
    label: category.description,
    value: category.categoryId,
  }));
  return {
    genreOptions,
    categoryOptions,
  };
}
