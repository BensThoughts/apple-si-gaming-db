export default function RoundedButton({ className, children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`px-4 py-2 rounded bg-secondary hover:bg-secondary-highlight ${className}`} {...rest}>
      {children}
    </button>
  );
}
