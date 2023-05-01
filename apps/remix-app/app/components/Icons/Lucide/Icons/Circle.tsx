import LucideIcon from '../LucideIcon';
import type { LucideIconProps } from '../LucideIcon';

export function CircleIcon({
  size = 24,
  ...rest
}: LucideIconProps) {
  return (
    <LucideIcon
      size={size}
      {...rest}
    >
      <title>Circle</title>
      <circle cx="12" cy="12" r="10"></circle>
    </LucideIcon>
  );
}

