export type BaseSvgIconProps = {
  size?: number,
} & React.SVGAttributes<SVGElement>

export function BaseSvgIcon({
  // viewBox = '0 0 24 24',
  size,
  width,
  height,
  children,
  ...rest
}: BaseSvgIconProps) {
  return (
    <svg
      width={width ? width : size}
      height={height ? height : size}
      {...rest}
    >
      {children}
    </svg>
  );
};
