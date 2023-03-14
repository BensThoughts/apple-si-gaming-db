import PageWrapper from './PageWrapper';

export default function ErrorDisplay({
  currentRoute,
  error,
}: {
  currentRoute: string;
  error: Error;
}) {
  const {
    name,
    message,
    // stack,
  } = error;
  return (
    <PageWrapper currentRoute={currentRoute} topSpacer>
      <div className="flex flex-col gap-4 w-full h-[calc(100vh_-_14rem)] items-center justify-center">
        <h1 className="text-4xl md:text-6xl text-primary-highlight">Oops! - {name}</h1>
        <p>{message}</p>
        {/* <pre className="text-xs">{stack}</pre> */}
      </div>
    </PageWrapper>
  );
}
