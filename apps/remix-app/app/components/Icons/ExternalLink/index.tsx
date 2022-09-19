// #f772d4
// #ad6cf6
import FeatherIcon from '../FeatherIcon';

type IconProps = {
  size?: number,
  color?: string,
} & React.SVGAttributes<SVGElement>

export default function ExternalLink({
  size = 24,
  color,
  fill = 'none',
  ...rest
}: IconProps) {
  return (
    <FeatherIcon
      size={size}
      stroke={color}
      fill={fill}
      {...rest}
    >
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </FeatherIcon>
  );
}
