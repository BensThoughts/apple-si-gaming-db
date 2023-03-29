import {
  BleedingHeartOutlineIcon,
  CommentsOutlineIcon,
  MessageOutlineIcon,
  // MonitorOutlineIcon,
  SearchDatabaseOutlineIcon,
  // SyncOutlineIcon,
} from '~/components/Icons/FlatIcons/Outline';
import FeatureCards from './FeatureCards';

export default function FeaturesSection() {
  return (
    <section className="flex flex-col items-center gap-6 w-full">
      <h2 className="sr-only">New Features</h2>
      <div>
        <FeatureCards
          features={[
            {
              title: 'Discover',
              to: '/apps',
              content: 'Search for games by Apple compatibility, genres, and categories (e.g. Full Controller Support)',
              Icon: SearchDatabaseOutlineIcon,
            },
            {
              title: 'View',
              to: '/apps',
              content: 'View posts about a games compatibility with your Apple computer prior to purchasing it',
              Icon: CommentsOutlineIcon,
            },
            {
              title: 'Like',
              to: '/profile/liked-posts',
              content: 'Save your favorite posts to your Steam profile so that you can easily find them again',
              Icon: BleedingHeartOutlineIcon,
            },
            {
              title: 'Create',
              to: '/profile/library',
              content: 'Create posts to let other people know if a game works, how well it works, and how you got it running',
              Icon: MessageOutlineIcon,
            },
          ]}
        />
      </div>
    </section>
  );
}
