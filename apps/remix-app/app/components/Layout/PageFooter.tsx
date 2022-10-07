import { DiscordIcon, RedditIcon, TwitterIcon } from '../Icons';

export default function PageFooter({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <footer className={`w-full h-fit min-h-min col bg-app-bg-secondary px-4 py-2 ${className}`}>
      <div className="flex justify-between items-center w-full h-full">
        <div className="flex flex-col gap-1 text-xs md:text-sm">
          <i className="italic text-sm">Designed by BensThoughts</i>
          <div>
            This site has no affiliation with Valve Software.
          </div>
          <div>
            All game images and logos are property of their respective owners.
          </div>
        </div>
        <div className="flex gap-2.5 items-center justify-center p-2 h-full">
          <a
            href="https://twitter.com/bensthoughts"
            rel="noopener noreferrer"
            target="_blank"
            className="block"
          >
            <TwitterIcon size={28} />
          </a>
          <a
            href="https://discord.com/users/512126890362798110"
            rel="noopener noreferrer"
            target="_blank"
            className="block"
          >
            <DiscordIcon size={28} />
          </a>
          <a
            href="https://www.reddit.com/user/BenjaminsThoughts"
            rel="noopener noreferrer"
            target="_blank"
            className="block"
          >
            <RedditIcon size={28} />
          </a>
        </div>
      </div>
    </footer>
  );
}
