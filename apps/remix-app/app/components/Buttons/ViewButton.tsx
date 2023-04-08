import { Link } from '@remix-run/react';
import { EyeIcon } from '~/components/Icons';

export default function ViewButton({
  steamAppId,
  performancePostId,
}: {
  steamAppId: number;
  performancePostId: number;
}) {
  return (
    <div className="flex items-center">
      <Link
        to={`/apps/${steamAppId}/posts/#${performancePostId}`}
        className="hover:text-primary-highlight bg-primary hover:bg-primary-highlight
                     focus:outline-none min-h-[38px] focus-visible:show-ring-primary
                     flex gap-1 items-center rounded-full border-secondary-highlight
                     border-1 py-1 px-3"
      >
        <div className="pb-0.5">
          <EyeIcon className="stroke-1" />
        </div>
        <span className="text-sm font-light">
            View
        </span>

      </Link>
    </div>
  );
}
