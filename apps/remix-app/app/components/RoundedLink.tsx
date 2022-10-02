import type { RemixLinkProps } from '@remix-run/react/dist/components';
import { Link } from '@remix-run/react';

export default function RoundedLink({ to, className, children, ...rest }: RemixLinkProps) {
  return (
    <Link
      to={to}
      className={`text-sm text-primary-highlight inline-flex justify-center items-center
                  border border-transparent font-medium px-4 py-2 rounded
                  bg-secondary hover:bg-secondary-highlight focus-visible:bg-secondary-highlight
                  focus-visible:show-ring ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
