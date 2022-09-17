import { Tab } from '@headlessui/react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AppInfoTabs({
  macRequirementsMinimum,
  pcRequirementsMinimum,
  linuxRequirementsMinimum,
}: {
  macRequirementsMinimum?: string | null;
  pcRequirementsMinimum?: string | null,
  linuxRequirementsMinimum?: string | null,
}) {
  return (
    <div className='w-full max-w-2xl px-2 sm:px-0'>
      <Tab.Group>
        <Tab.List className='flex space-x-1 rounded-xl bg-primary p-1'>
          {macRequirementsMinimum && (
            <Tab
              key='Apple'
              className={({ selected }) =>
                classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                  ? 'bg-white shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
                )
              }
            >
              Apple
            </Tab>
          )}
          {pcRequirementsMinimum && (
            <Tab
              key='Apple'
              className={({ selected }) =>
                classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                  ? 'bg-white shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
                )
              }
            >
              Windows
            </Tab>
          )}
          {linuxRequirementsMinimum && (
            <Tab
              key='Apple'
              className={({ selected }) =>
                classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                  ? 'bg-white shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
                )
              }
            >
              Linux
            </Tab>
          )}
        </Tab.List>
        <Tab.Panels className='mt-2'>
          {macRequirementsMinimum && (
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
          {pcRequirementsMinimum && (
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
          {linuxRequirementsMinimum && (
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
