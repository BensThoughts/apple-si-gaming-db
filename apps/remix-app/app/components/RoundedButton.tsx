export default function RoundedButton({ className, children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`text-sm text-primary-highlight inline-flex justify-center items-center
                  border border-transparent font-medium px-4 py-2 rounded
                  bg-secondary hover:bg-secondary-highlight focus:outline-none
                  focus-visible:bg-secondary-highlight focus-visible:ring-2
                  focus-visible:ring-secondary-highlight focus-visible:ring-offset-1
                  focus-visible:ring-offset-white ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
