// #f772d4
// #ad6cf6
import FeatherIcon from '../FeatherIcon';

type IconProps = {
  size?: number,
  color?: string,
  gradient?: boolean,
} & React.SVGAttributes<SVGElement>

export default function Bars({
  size = 24,
  color = 'currentColor',
  gradient,
  fill = 'currentColor',
  ...rest
}: IconProps) {
  return (
    <FeatherIcon
      size={size}
      stroke={color}
      fill={fill}
      color={color}
      {...rest}
    >
      <path d="M3 12h18M3 6h18M3 18h18" />
    </FeatherIcon>
  );
}
