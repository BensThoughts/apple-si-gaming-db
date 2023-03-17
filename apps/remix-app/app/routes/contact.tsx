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
    <PageWrapper currentRoute="/contact" title="Contact" topSpacer>
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
        {/* Small Screens */}
        <div className="md:hidden px-2">
          <AsideCard title="Suggestions" iconBackground="bg-app-bg">
            <div className="flex flex-col gap-6">
              <p>
                The site is currently pre-alpha.  Please join the Discord or
                click the button below to fill out a suggestion form.
              </p>
              <div className="flex justify-center w-full">
                <a
                  href="https://forms.gle/zwbr9cdKUZgEopnDA"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex py-2 px-4 bg-secondary hover:bg-secondary-highlight rounded-lg focus:show-ring"
                >
                  I have suggestions!
                </a>
              </div>

            </div>
          </AsideCard>
        </div>

        {/* Medium Screens */}
        <div className="hidden md:flex md:justify-center bg-tertiary w-full max-w-2xl px-8 pb-8 pt-6 rounded-lg border-1 border-secondary-highlight">
          <AsideCard title="Suggestions" iconBackground="bg-tertiary">
            <div className="flex flex-col gap-6">
              <p>
                The site is currently pre-alpha.  Please join the Discord or
                click the button below to fill out a suggestion form.
              </p>
              <div className="flex justify-center w-full">
                <a
                  href="https://forms.gle/zwbr9cdKUZgEopnDA"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex py-2 px-4 bg-secondary hover:bg-secondary-highlight rounded-lg focus:show-ring"
                >
                  I have suggestions!
                </a>
              </div>

            </div>
          </AsideCard>
        </div>
      </div>
    </PageWrapper>
  );
}
