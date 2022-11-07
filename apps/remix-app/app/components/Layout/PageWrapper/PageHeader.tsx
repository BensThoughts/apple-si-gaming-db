type PageHeaderProps = {
  title: string;
  titlePosition: 'left' | 'center';
} & React.HTMLAttributes<HTMLDivElement>

export default function PageHeader({
  title,
  titlePosition,
  className,
}: PageHeaderProps) {
  return (
    <header className={`w-full min-h-[52px] bg-primary py-2 px-6 ${className}`}>
      <h1 className={`text-2xl md:text-3xl text-secondary
                      ${titlePosition === 'left' ? 'text-left' : 'text-center'}`}>
        {title}
      </h1>
    </header>
  );
}
