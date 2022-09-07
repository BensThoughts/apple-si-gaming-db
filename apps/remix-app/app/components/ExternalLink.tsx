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
                  transition-colors duration-200 ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}
