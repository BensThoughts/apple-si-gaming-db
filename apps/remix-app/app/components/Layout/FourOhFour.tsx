import PageWrapper from './PageWrapper';

export default function FourOhFour({
  currentRoute,
  children,
}: {
  currentRoute: string;
  children?: React.ReactNode;
}) {
  return (
    <PageWrapper topSpacer>
      <div className="flex flex-col gap-4 w-full h-[calc(100vh_-_14rem)] items-center justify-center">
        <h1 className="text-4xl md:text-6xl text-primary-highlight">Oops! - 404 Error</h1>
        {children}
      </div>
    </PageWrapper>
  );
}
