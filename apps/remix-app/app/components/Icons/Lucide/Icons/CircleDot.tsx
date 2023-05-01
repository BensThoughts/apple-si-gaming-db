import LucideIcon from '../LucideIcon';
import type { LucideIconProps } from '../LucideIcon';

export function CircleDotIcon({
  size = 24,
  ...rest
}: LucideIconProps) {
  return (
    <LucideIcon
      size={size}
      {...rest}
    >
      <title>Circle Dot</title>
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="1"></circle>
    </LucideIcon>
  );
}
