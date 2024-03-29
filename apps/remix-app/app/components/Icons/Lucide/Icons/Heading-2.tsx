import LucideIcon from '../LucideIcon';
import type { LucideIconProps } from '../LucideIcon';

export function HeadingTwoIcon({
  size = 24,
  ...rest
}: LucideIconProps) {
  return (
    <LucideIcon
      size={size}
      {...rest}
    >
      <title>Heading 2</title>
      <path d="M4 12h8"></path><path d="M4 18V6"></path><path d="M12 18V6"></path>
      <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"></path>
    </LucideIcon>
  );
}
