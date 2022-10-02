type ExternalLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

export default function ExternalLink({
  href,
  children,
  className,
  ...rest
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      className={`underline underline-offset-4 hover:text-icon-secondary
                  transition-colors duration-200 focus-visible:text-secondary-highlight
                  outline-none ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}
