export default function RoundedButton({ className, children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`text-sm text-primary-highlight inline-flex justify-center items-center
                  border border-transparent font-medium px-4 py-2 rounded
                  bg-secondary hover:bg-secondary-highlight focus-visible:bg-secondary-highlight
                  focus-visible:show-ring min-w-[89.66px] ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
