import { Tab } from '@headlessui/react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AppInfoTabs({
  mac,
  windows,
  linux,
}: {
  mac: {
    macRequirementsMinimum?: string | null;
    platformMac?: boolean | null;
  },
  windows: {
    pcRequirementsMinimum?: string | null;
    platformWindows?: boolean | null;
  },
  linux: {
    linuxRequirementsMinimum?: string | null;
    platformLinux?: boolean | null;
  }
}) {
  const { macRequirementsMinimum, platformMac } = mac;
  const { pcRequirementsMinimum, platformWindows } = windows;
  const { linuxRequirementsMinimum, platformLinux } = linux;
  return (
    <div className='w-full max-w-2xl px-2 sm:px-0'>
      <Tab.Group>
        <Tab.List className='flex space-x-1 rounded-xl bg-primary p-1'>
          {(platformMac && macRequirementsMinimum) && (
            <Tab
              className={({ selected }) =>
                classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                    ? 'bg-primary-highlight shadow'
                    : 'text-blue-100 hover:bg-primary-highlight hover:text-secondary-highlight',
                )
              }
            >
              Apple
            </Tab>
          )}
          {(platformWindows && pcRequirementsMinimum) && (
            <Tab
              className={({ selected }) =>
                classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                  ? 'bg-primary-highlight shadow'
                  : 'text-blue-100 hover:bg-primary-highlight hover:text-secondary-highlight',
                )
              }
            >
              Windows
            </Tab>
          )}
          {(platformLinux && linuxRequirementsMinimum) && (
            <Tab
              className={({ selected }) =>
                classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                    ? 'bg-primary-highlight shadow'
                    : 'text-blue-100 hover:bg-primary-highlight hover:text-secondary-highlight',
                )
              }
            >
              Linux
            </Tab>
          )}
        </Tab.List>
        <Tab.Panels className='mt-2'>
          {(platformMac && macRequirementsMinimum) && (
            <Tab.Panel
              className={classNames(
                  'rounded-xl bg-white p-3',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
              )}
            >
              <div
                dangerouslySetInnerHTML={{ __html: macRequirementsMinimum }}
                className='text-sm'
              />
            </Tab.Panel>
          )}
          {(platformWindows && pcRequirementsMinimum) && (
            <Tab.Panel
              className={classNames(
                  'rounded-xl bg-white p-3',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
              )}
            >
              <div
                dangerouslySetInnerHTML={{ __html: pcRequirementsMinimum }}
                className='text-sm'
              />
            </Tab.Panel>
          )}
          {(platformLinux && linuxRequirementsMinimum) && (
            <Tab.Panel
              className={classNames(
                  'rounded-xl bg-white p-3',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
              )}
            >
              <div
                dangerouslySetInnerHTML={{ __html: linuxRequirementsMinimum }}
                className='text-sm'
              />
            </Tab.Panel>
          )}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
