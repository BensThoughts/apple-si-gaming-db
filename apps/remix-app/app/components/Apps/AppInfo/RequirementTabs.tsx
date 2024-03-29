import { Fragment } from 'react';
import { Tab } from '@headlessui/react';
import { classNames } from '~/lib/css/classNames';

export default function RequirementTabs({
  platforms,
}: {
  platforms: {
    platformName: string,
    platformSupported?: boolean | null;
    requirementsMinimum?: string | null;
  }[],
}) {
  return (
    <div className="w-full max-w-2xl px-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-md bg-primary p-1">
          {platforms.map(({
            platformName,
            platformSupported,
            requirementsMinimum,
          }, idx) => (
            <Fragment key={platformName + idx}>
              {(platformSupported && requirementsMinimum) &&
                <Tab
                  className={({ selected }) => classNames(
                      'w-full rounded py-1.5 text-sm font-medium leading-5 text-primary',
                      'focus-visible:show-ring-tertiary ring-secondary-highlight',
                      selected
                      ? 'text-primary-highlight bg-primary-highlight'
                      : 'text-primary hover:bg-primary-highlight hover:text-secondary-highlight',
                  )}
                >
                  {platformName}
                </Tab>
              }
            </Fragment>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {platforms.map(({
            platformName,
            platformSupported,
            requirementsMinimum,
          }, idx) => (
            <Fragment key={platformName + idx}>
              {(platformSupported && requirementsMinimum) &&
                <Tab.Panel
                  className="rounded-xl p-3 focus-visible:show-ring-tertiary"
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: requirementsMinimum }}
                    className="text-sm"
                  />
                </Tab.Panel>
              }
            </Fragment>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
