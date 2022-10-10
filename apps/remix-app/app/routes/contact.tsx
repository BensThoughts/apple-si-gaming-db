import type { MetaFunction } from '@remix-run/node';
import AsideCard from '~/components/Cards/AsideCard';
import { DiscordIcon, RedditIcon, TwitterIcon } from '~/components/Icons';
import PageWrapper from '~/components/Layout/PageWrapper';
import { metaTags } from '~/lib/meta-tags';

export const meta: MetaFunction = () => ({
  'title': `${metaTags.title} - Contact`,
});

export default function ContactRoute() {
  return (
    <PageWrapper title="Contact">
      <div className="flex flex-col gap-6 items-center w-full">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between w-full max-w-2xl p-4 bg-tertiary rounded-md border-1 border-secondary-highlight">
          <a
            href="https://twitter.com/bensthoughts"
            rel="noopener noreferrer"
            target="_blank"
            className="rounded-lg py-4 flex flex-col gap-2 w-full items-center justify-center hover:text-secondary focus-visible:show-ring hover:bg-tertiary-highlight"
          >
            <TwitterIcon size={40} /> DM Me on Twitter
          </a>
          <a
            href="https://discord.gg/8Ub5669qJv"
            rel="noopener noreferrer"
            target="_blank"
            className="rounded-lg py-4 flex flex-col gap-2 w-full items-center justify-center hover:text-secondary focus-visible:show-ring hover:bg-tertiary-highlight"
          >
            <DiscordIcon size={40} /> Join the Discord
          </a>
          <a
            href="https://www.reddit.com/user/BenjaminsThoughts"
            rel="noopener noreferrer"
            target="_blank"
            className="rounded-lg py-4 flex flex-col gap-2 w-full items-center justify-center hover:text-secondary focus-visible:show-ring hover:bg-tertiary-highlight"
          >
            <RedditIcon size={40} /> Message me on Reddit
          </a>
        </div>
        <div className="bg-tertiary w-full max-w-lg px-8 pb-8 pt-6 rounded-lg border-1 border-secondary-highlight">
          <AsideCard title="Suggestions" iconBackground="bg-tertiary">
            The site is currently pre-alpha.  Please join the Discord or
            fill out the suggestion form below if you have any suggestions
            to improve it.
          </AsideCard>
        </div>
        <div className="flex justify-center items-center w-full">
          <iframe
            title="Google Suggestion Form"
            src="https://docs.google.com/forms/d/e/1FAIpQLScqU74BFS0uzbw8N7HDVhVY8EH5cY0ttsKHA1jLUhuCMnugew/viewform?embedded=true"
            width="640"
            height="1740"
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
