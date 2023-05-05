import RemixUnderlineLink from '~/components/RemixUnderlineLink';
import SystemSelectMenu from './SystemSelectMenu';
import type { SystemSpecOption } from '~/types';

export default function SystemSelectMenuCard({
  systemSpecOptions,
  defaultSystemSpecId,
}: {
  systemSpecOptions: SystemSpecOption[];
  defaultSystemSpecId?: number;
}) {
  return (
    <div
      className="flex flex-col gap-2 justify-center items-center rounded-md
               md:border-1 md:border-secondary-highlight p-4"
    >
      <div className="text-primary-faded">
      You can choose to select a system from your&nbsp;
        <RemixUnderlineLink to="/profile/systems">
        profile
        </RemixUnderlineLink>
      &nbsp;to easily attach system information to your post.
      </div>
      <SystemSelectMenu systemSpecOptions={systemSpecOptions} />
    </div>
  );
}
