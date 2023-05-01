import LucideIcon from '../LucideIcon';
import type { LucideIconProps } from '../LucideIcon';

export function ListIcon({
  size = 24,
  ...rest
}: LucideIconProps) {
  return (
    <LucideIcon
      size={size}
      {...rest}
    >
      <title>List</title>
      <line x1="8" x2="21" y1="6" y2="6"></line>
      <line x1="8" x2="21" y1="12" y2="12"></line>
      <line x1="8" x2="21" y1="18" y2="18"></line>
      <line x1="3" x2="3.01" y1="6" y2="6"></line>
      <line x1="3" x2="3.01" y1="12" y2="12"></line>
      <line x1="3" x2="3.01" y1="18" y2="18"></line>
    </LucideIcon>
  );
}
