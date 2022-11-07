import PageWrapper from '~/components/Layout/PageWrapper';

export default function FourOhFourSplatRoute() {
  return (
    <PageWrapper topSpacer>
      <div className="flex w-full h-[calc(100vh_-_14rem)] items-center justify-center">
        <h1 className="text-4xl md:text-6xl text-primary-highlight">Oops! - 404 Error</h1>
      </div>
    </PageWrapper>
  );
}
