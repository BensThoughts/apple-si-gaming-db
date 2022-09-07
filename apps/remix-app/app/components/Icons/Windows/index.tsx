// #f772d4
// #ad6cf6
import FasIcon from '../FasIcon';

type IconProps = {
  size?: number,
  color?: string,
  gradient?: boolean,
} & React.SVGAttributes<SVGElement>

export default function WindowsIcon({
  size = 24,
  color,
  gradient,
  ...rest
}: IconProps) {
  return (
    <FasIcon
      size={size}
      fill={color}
      gradient={gradient}
      viewBox="0 0 24 24"
      {...rest}
    >
      <title>Windows 11 Icon</title>
      <path d="M0,0H11.377V11.372H0ZM12.623,0H24V11.372H12.623ZM0,12.623H11.377V24H0Zm12.623,0H24V24H12.623"/>
    </FasIcon>
  );
};
