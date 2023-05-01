import LucideIcon from '../LucideIcon';

type IconProps = {
  size?: number,
  color?: string,
} & React.SVGAttributes<SVGElement>

export function StrikethroughIcon({
  size = 24,
  ...rest
}: IconProps) {
  return (
    <LucideIcon
      size={size}
      {...rest}
    >
      <title>Strikethrough</title>
      <path d="M16 4H9a3 3 0 0 0-2.83 4"></path><path d="M14 12a4 4 0 0 1 0 8H6"></path>
      <line x1="4" x2="20" y1="12" y2="12"></line>
    </LucideIcon>
  );
}
