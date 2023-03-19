export function validatePageNumber(page: number) {
  if (!isFinite(page)) {
    return `Page must be a positive finite number`;
  }
  if (page < 1) {
    return `Page must be a positive number, greater than zero`;
  }
}

export function validateAppName(appName: string) {
  if (appName.length > 50) {
    return `The search query is too long (50 character maximum)`;
  }
  // if (searchQuery.length < 2) {
  //   return `Search query must contain at least 2 character`;
  // }
}

export function validateGenreIds(
    genreIds: string[],
    validGenreIds: string[],
) {
  let invalidGenreId: string | undefined;

  const hasInvalidGenreId = genreIds.some((genreId) => {
    const isValidCategoryId =
      validGenreIds.some((validGenreId) => validGenreId === genreId);
    if (!isValidCategoryId) {
      invalidGenreId = genreId;
      return true;
    }
    return false;
  });
  if (hasInvalidGenreId) {
    return `Genre Id ${invalidGenreId} was not a valid option`;
  }
}

export function validateCategoryIds(
    categoryIds: number[],
    validCategoryIds: number[],
) {
  let invalidCategoryId: number | undefined;

  const hasInvalidCategoryId = categoryIds.some((categoryId) => {
    const isValidCategoryId =
      validCategoryIds
          .some((validCategoryId) => validCategoryId === categoryId);

    if (!isValidCategoryId) {
      invalidCategoryId = categoryId;
      return true;
    }
    return false;
  });
  if (hasInvalidCategoryId) {
    return `Category Id ${invalidCategoryId} was not a valid option`;
  }
}
