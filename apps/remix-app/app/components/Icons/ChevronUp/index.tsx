// #f772d4
// #ad6cf6
import FeatherIcon from '../FeatherIcon';

type IconProps = {
  size?: number,
} & React.SVGAttributes<SVGElement>

export default function ChevronUp({
  size = 24,
  stroke = 'currentColor',
  fill = 'none',
  strokeWidth = 1.5,
  ...rest
}: IconProps) {
  return (
    <FeatherIcon
      size={size}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </FeatherIcon>
  );
}
