export type SearchFormState = {
  formError?: string;
  fieldErrors?: {
    appName?: string | undefined;
    genreIds?: string | undefined;
    categoryIds?: string | undefined;
  };
  fields?: {
    appName: string;
    appleOnly: boolean;
    genreIds?: string[];
    categoryIds?: number[];
  }
  // fields?: SearchFormFields;
}
