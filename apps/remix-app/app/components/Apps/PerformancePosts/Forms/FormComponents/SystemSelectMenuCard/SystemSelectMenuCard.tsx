import RemixUnderlineLink from '~/components/RemixUnderlineLink';
import SystemSelectMenu from './SystemSelectMenu';
import type { SystemSpecSelectOption } from './SystemSelectMenu';

export default function SystemSelectMenuCard({
  systemSpecOptions,
}: {
  systemSpecOptions: SystemSpecSelectOption[];
}) {
  return (
    <div
      className="flex flex-col gap-2 justify-center items-center rounded-md
                 md:border-1 md:border-secondary-highlight p-4"
    >
      <div className="text-primary-faded">
      You can select a system from your&nbsp;
        <RemixUnderlineLink to="/profile/systems">
        profile
        </RemixUnderlineLink>
      &nbsp;to easily attach system information to your post.
      </div>
      <SystemSelectMenu systemSpecOptions={systemSpecOptions} />
    </div>
  );
}
