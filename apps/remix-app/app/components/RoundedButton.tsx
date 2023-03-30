type RoundedButtonProps = {
  width?: 'regular' | 'wide';
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function RoundedButton({
  width = 'regular',
  className,
  children,
  ...rest
}: RoundedButtonProps) {
  return (
    <button
      className={`text-sm text-primary-highlight inline-flex justify-center items-center
                  border border-transparent font-medium px-4 py-2 rounded
                  bg-secondary hover:bg-secondary-highlight focus-visible:bg-secondary-highlight
                  h-[38px] focus-visible:show-ring
                  ${width === 'regular' ? 'w-[89.66px]' : 'w-36'}
                  ${className}
                `}
      // previously had min-w-[89.66px]
      {...rest}
    >
      {children}
    </button>
  );
}
