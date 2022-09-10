import FeatherIcon from '../FeatherIcon';

type IconProps = {
  size?: number,
} & React.SVGAttributes<SVGElement>

export default function Check({
  size = 24,
  stroke = 'currentColor',
  fill = 'none',
  strokeWidth = 1.5,
  className = 'w-6 h-6',
  ...rest
}: IconProps) {
  return (
    <FeatherIcon
      size={size}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      className={className}
      {...rest}
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </FeatherIcon>
  );
}
