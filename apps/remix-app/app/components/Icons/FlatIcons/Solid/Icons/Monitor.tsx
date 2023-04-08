import FlatIconSolid from '../FlatIconSolid';
import type { FlatIconSolidProps } from '../FlatIconSolid';

export function MonitorSolidIcon({
  size = 24,
  ...rest
}: FlatIconSolidProps) {
  return (
    <FlatIconSolid
      viewBox="0 0 60 60"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d="m22.618 50-2 4h18.764l-2-4z" />
      <path d="m45 56h-30a1 1 0 0 0 0 2h30a1 1 0 0 0 0-2z" />
      <path d="m2 46.818a1.117 1.117 0 0 0 1 1.182h54a1.117 1.117 0 0 0 1-1.182v-2.818h-56z" />
      <path
        d="m57 2h-54a1.117 1.117 0 0 0 -1 1.182v38.818h56v-38.818a1.117 1.117 0 0 0 -1-1.182zm-52.707 4.293 2-2a1 1 0 0 1 1.414 1.414l-2 2a1 1 0 0 1 -1.414-1.414zm8.414-.586-7 7a1 1 0 0 1 -1.414-1.414l7-7a1 1 0 1 1 1.414 1.414z" />
    </FlatIconSolid>
  );
}

