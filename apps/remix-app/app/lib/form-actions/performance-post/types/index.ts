// import type { CreatePerformancePostActionData } from './CreatePerformancePostAction';
// import type { EditPerformancePostActionData } from './EditPerformancePostAction';
import type {
  PerformancePostFormError,
  PerformancePostFormFieldErrors,
  PerformancePostFormFieldsTyped,
} from './FormFields';

export type CreateOrEditPerformancePostActionData = {
  formError?: PerformancePostFormError;
  fields?: PerformancePostFormFieldsTyped; // used for defaultValue options
  fieldErrors?: PerformancePostFormFieldErrors;
}

export type { PerformancePostFormFieldsRaw } from './FormFields';
