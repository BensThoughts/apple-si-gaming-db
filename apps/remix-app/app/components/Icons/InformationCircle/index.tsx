// #f772d4
// #ad6cf6
import FasIcon from '../FasIcon';

type IconProps = {
  size?: number,
} & React.SVGAttributes<SVGElement>

export default function InformationCircle({
  size = 32,
  fill = 'none',
  stroke = 'currentColor',
  strokeWidth = 2,
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  ...rest
}: IconProps) {
  return (
    <FasIcon
      size={size}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      viewBox="0 0 24 24"
      {...rest}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </FasIcon>
  );
};
