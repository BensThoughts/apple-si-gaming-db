import LucideIcon from '../LucideIcon';

type IconProps = {
  size?: number,
  color?: string,
} & React.SVGAttributes<SVGElement>

export function CircleDotIcon({
  size = 24,
  ...rest
}: IconProps) {
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
