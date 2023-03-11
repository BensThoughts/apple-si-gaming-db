import type { ThrownResponse } from '@remix-run/react';
import PageWrapper from './PageWrapper';

export default function ErrorDisplay({
  currentRoute,
  thrownResponse,
}: {
  currentRoute: string;
  thrownResponse: ThrownResponse<number, any>;
}) {
  const {
    status,
    statusText,
    data,
  } = thrownResponse;
  return (
    <PageWrapper currentRoute={currentRoute} topSpacer>
      <div className="flex flex-col gap-4 w-full h-[calc(100vh_-_14rem)] items-center justify-center">
        <h1 className="text-4xl md:text-6xl text-primary-highlight">Oops! - {status} Error</h1>
        <p>{statusText} - {data}</p>
        {/* <p>Error in {currentRoute} route</p> */}
      </div>
    </PageWrapper>
  );
}
