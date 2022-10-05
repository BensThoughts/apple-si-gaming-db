import AsideCard from '~/components/Cards/AsideCard';
import PageWrapper from '~/components/Layout/PageWrapper';

export default function ContactRoute() {
  return (
    <PageWrapper title="Contact">
      <div className="flex flex-col gap-6 items-center w-full">
        <div className="bg-tertiary w-full max-w-lg px-8 pb-8 pt-6 rounded-lg border-1 border-secondary-highlight">
          <AsideCard title="Contact" iconBackground="bg-tertiary">
            The site is currently pre-alpha.  Please fill out the suggestion form below
            if you have any suggestions to improve it.
          </AsideCard>
        </div>
        <div className="flex justify-center items-center w-full">
          <iframe
            title="Google Suggestion Form"
            src="https://docs.google.com/forms/d/e/1FAIpQLScqU74BFS0uzbw8N7HDVhVY8EH5cY0ttsKHA1jLUhuCMnugew/viewform?embedded=true"
            width="640"
            height="1596"
            frameBorder="0"
            className="relative inset-0"
            // marginHeight="0"
            // marginwidth="0"
          >Loading…</iframe>
        </div>
      </div>

    </PageWrapper>
  );
}
