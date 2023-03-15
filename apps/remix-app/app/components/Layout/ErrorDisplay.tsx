import PageWrapper from './PageWrapper';

const MainErrorDisplay = ({
  error,
} : {
  error: Error
}) => {
  const { name, message } = error;
  return (
    <div className="flex flex-col gap-4 w-full h-[calc(100vh_-_14rem)] items-center justify-center">
      <h1 className="text-4xl md:text-6xl text-primary-highlight">Oops! - {name}</h1>
      <p>{message}</p>
      {/* <pre className="text-xs">{stack}</pre> */}
    </div>
  );
};

export default function ErrorDisplay({
  includePageWrapper,
  currentRoute,
  error,
}: {
  includePageWrapper: boolean;
  currentRoute: string;
  error: Error;
}) {
  if (includePageWrapper) {
    return (
      <PageWrapper currentRoute={currentRoute} topSpacer>
        <MainErrorDisplay error={error} />
      </PageWrapper>
    );
  }
  return <MainErrorDisplay error={error} />;
}
