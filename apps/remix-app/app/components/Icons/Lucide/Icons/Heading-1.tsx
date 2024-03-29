import LucideIcon from '../LucideIcon';
import type { LucideIconProps } from '../LucideIcon';

export function HeadingOneIcon({
  size = 24,
  ...rest
}: LucideIconProps) {
  return (
    <LucideIcon
      size={size}
      {...rest}
    >
      <title>Heading 1</title>
      <path d="M4 12h8"></path><path d="M4 18V6"></path>
      <path d="M12 18V6"></path><path d="m17 12 3-2v8"></path>
    </LucideIcon>
  );
}
