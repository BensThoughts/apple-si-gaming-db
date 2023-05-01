import LucideIcon from '../LucideIcon';

type IconProps = {
  size?: number,
  color?: string,
} & React.SVGAttributes<SVGElement>

export function ListOrderedIcon({
  size = 24,
  ...rest
}: IconProps) {
  return (
    <LucideIcon
      size={size}
      {...rest}
    >
      <title>List Ordered</title>
      <line x1="10" x2="21" y1="6" y2="6"></line>
      <line x1="10" x2="21" y1="12" y2="12"></line>
      <line x1="10" x2="21" y1="18" y2="18"></line>
      <path d="M4 6h1v4"></path><path d="M4 10h2"></path>
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
    </LucideIcon>
  );
}
