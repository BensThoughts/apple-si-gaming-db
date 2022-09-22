import PageFooter from './PageFooter';
import PageHeader from './PageHeader';
import PageMain from './PageMain';

type PageProps = { title?: string; } & React.HTMLAttributes<HTMLDivElement>

export default function PageWrapper({
  title,
  children,
}: PageProps) {
  return (
    <div className="flex flex-col justify-between h-[calc(100vh_-_3.5rem)]">
      <div>
        {title && <PageHeader title={title} titlePosition="left" className="mb-4 md:mb-8" />}
        <PageMain className="mt-4 md:mt-8 mb-10">
          {children}
        </PageMain>
      </div>
      <PageFooter className="mt-10" />
    </div>
  );
}
