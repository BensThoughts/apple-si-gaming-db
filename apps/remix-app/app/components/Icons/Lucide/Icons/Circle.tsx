import LucideIcon from '../LucideIcon';

type IconProps = {
  size?: number,
  color?: string,
} & React.SVGAttributes<SVGElement>

export function CircleIcon({
  size = 24,
  ...rest
}: IconProps) {
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

