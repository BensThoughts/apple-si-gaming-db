import {
  BleedingHeartOutlineIcon,
  CommentsOutlineIcon,
  MessageOutlineIcon,
  // MonitorOutlineIcon,
  SearchDatabaseOutlineIcon,
  // SyncOutlineIcon,
} from '~/components/Icons/FlatIcons/Outline';
// import { BleedingHeartSolidIcon } from '~/components/Icons/FlatIcons/Solid';
import NewFeatureCards from './NewFeatureCards';

export default function NewFeaturesSection() {
  return (
    <section className="flex flex-col items-center gap-6 w-full">
      <h2 className="sr-only">New Features</h2>
      <div>
        <NewFeatureCards
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

      {/* <NewFeatureCards
        features={[
          {
            title: 'Average Frame Rate',
            content: 'Added ability to post average frame rate and stutter',
            Icon: MonitorOutlineIcon,
          },
          {
            title: 'Re-Sync Library',
            content: 'Added ability to re-sync Steam library from the user profile page',
            Icon: SyncOutlineIcon,
          },
          {
            title: 'Search Filters',
            content: 'Added search filters for Apple compatibility, genres, and categories (e.g. Full Controller Support)',
            Icon: SearchDatabaseOutlineIcon,
          },
        ]}
      /> */}
      {/* <div className="flex justify-center gap-4 w-full">
        <NewFeatureCardV2 Icon={SearchDatabaseOutlineIcon} title="Like Posts">
          Added ability to like posts and see all the posts you liked in your profile
        </NewFeatureCardV2>
        <NewFeatureCardV2 Icon={CommentsOutlineIcon} title="View Posts">
          Added section in profile to view all posts
        </NewFeatureCardV2>
        <NewFeatureCardV2 Icon={MessageOutlineIcon} title="New Posts">
          Added a "New Posts" section to highlight user posts
        </NewFeatureCardV2>
        <NewFeatureCardV2 Icon={MonitorOutlineIcon} title="Average Frame Rate">
          Added ability to post average frame rate and stutter
        </NewFeatureCardV2>
        <NewFeatureCardV2 Icon={SyncOutlineIcon} title="Re-Sync Library">
          Added ability to re-sync Steam library from the user profile page
        </NewFeatureCardV2>
        <NewFeatureCardV2 Icon={SearchDatabaseOutlineIcon} title="Search Filters">
          Added search filters for Apple compatibility, genres, and categories (e.g. Full Controller Support)
        </NewFeatureCardV2>
      </div> */}
    </section>
  );
}
