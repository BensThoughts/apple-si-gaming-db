
import { lazy, Suspense } from 'react';
import type { StylesConfig } from 'react-select';
import { ClientOnly } from '~/components/ClientOnlyBackup';
// import Select from 'react-select';
const Select = lazy(() => import('react-select'));

const styles: StylesConfig = {
  clearIndicator: (styles, state) => ({ ...styles }),
  container: (styles, state) => ({ ...styles }),
  control: (styles, state) => ({
    ...styles,
    borderWidth: 1.5,
    borderColor: state.isFocused ? 'rgb(var(--color-app-secondary-highlight))' : 'transparent',
  }),
  dropdownIndicator: (styles) => ({ ...styles }),
  group: (styles) => ({ ...styles }),
  groupHeading: (styles) => ({ ...styles }),
  indicatorsContainer: (styles) => ({ ...styles }),
  indicatorSeparator: (styles) => ({ ...styles }),
  input: (styles) => ({ ...styles }),
  loadingIndicator: (styles) => ({ ...styles }),
  loadingMessage: (styles) => ({ ...styles }),
  menu: (styles) => ({
    ...styles,
    borderWidth: 1,
    borderColor: 'rgb(var(--color-app-secondary-highlight))',
  }),
  menuList: (styles) => ({ ...styles }),
  menuPortal: (styles) => ({ ...styles }),
  multiValue: (styles) => ({ ...styles }),
  multiValueLabel: (styles) => ({ ...styles }),
  multiValueRemove: (styles) => ({ ...styles }),
  noOptionsMessage: (styles) => ({ ...styles }),
  option: (styles) => ({ ...styles }),
  placeholder: (styles) => ({ ...styles }),
  singleValue: (styles) => ({ ...styles }),
  valueContainer: (styles) => ({ ...styles }),
};

export interface MultiSelectOption<T = string | number> {
  label: string;
  value: T;
}

export default function MultiSelectMenu<T>({
  name,
  id,
  options,
  defaultValue,
  isMulti = false,
  openMenuOnFocus = false,
  closeMenuOnSelect = true,
  labelText,
  fieldError,
  required,
}: {
  name?: string;
  id?: string;
  options: MultiSelectOption<T>[];
  defaultValue?: MultiSelectOption<T>[]; // This is only good on multiSelect
  isMulti?: boolean;
  openMenuOnFocus?: boolean;
  closeMenuOnSelect?: boolean;
  labelText?: string;
  fieldError?: string;
  required?: boolean;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientOnly>
        <div>
          {labelText && (
            <label htmlFor={id}>
              <span className="text-primary">
                {labelText}
              </span>
              {required &&
            <span className="text-error">
              *
            </span>
              }
              {fieldError &&
            <span className="text-primary">
              {`: `}
              <span className="text-error">
                {fieldError}
              </span>
            </span>
              }
            </label>
          )}
          <div className="mt-1.5">
            <Select
              id={id}
              instanceId={`instanceId-${id}`}
              inputId={`inputId-${id}`}
              openMenuOnFocus={openMenuOnFocus}
              isMulti={isMulti}
              name={name}
              options={options}
              defaultValue={defaultValue}
              closeMenuOnSelect={closeMenuOnSelect}
              styles={styles}
              theme={(theme) => ({
                ...theme,
                borderRadius: 8,
                colors: {
                  ...theme.colors,
                  primary: 'rgb(var(--color-app-secondary-highlight))', // focus outline
                  primary75: theme.colors.primary75, // unsure
                  primary50: 'rgb(var(--color-app-secondary-highlight))', // click/select option
                  primary25: 'rgb(var(--color-app-secondary))', // hover option
                  danger: theme.colors.danger,
                  dangerLight: theme.colors.dangerLight,
                  neutral0: 'rgb(var(--color-app-primary))', // primary background
                  neutral5: theme.colors.neutral5, // unsure
                  neutral10: 'rgb(var(--color-app-secondary))', // tag background
                  neutral20: 'rgb(var(--color-text-primary))', // outline and carat when not selected
                  neutral30: 'transparent', // hover border color
                  neutral40: 'rgb(var(--color-text-primary))', // No Options Text
                  neutral50: 'rgb(var(--color-text-primary-highlight))', // Placeholder text
                  neutral60: 'rgb(var(--color-text-primary))', // dropdown carat and X when focused
                  neutral70: theme.colors.neutral70, // unsure
                  neutral80: 'rgb(var(--color-text-primary-highlight))', // input text color (also text color for tags and hover carat/clear X)
                  neutral90: theme.colors.neutral90, // unsure
                },
              })}
            />
          </div>
        </div>
      </ClientOnly>
    </Suspense>
  );
}
