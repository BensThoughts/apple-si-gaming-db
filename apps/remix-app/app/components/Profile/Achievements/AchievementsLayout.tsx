import Heading from '~/components/Heading';

interface AchievementsLayoutProps {
  siteAchievements: {
    achievementId: number;
    title: string;
    description: string;
    imageUrl: string;
    svgCode: string;
  }[]
}

export default function AchievementsLayout({
  siteAchievements,
}: AchievementsLayoutProps) {
  return (
    <div className="flex flex-col gap-8 items-center w-full p-4 bg-tertiary rounded-lg border-1 border-secondary-highlight">
      <Heading>Achievements</Heading>
       Earn achievements by posting on the site. Coming Soon!
      {/*
      {siteAchievements.map(({
        achievementId,
        title,
        description,
        imageUrl,
        svgCode,
      }) => (
        <div key={achievementId}>
          <div className="text-secondary">
            <div className="" />
            <div className="text-secondary stroke-[0.5]">
              <div dangerouslySetInnerHTML={{ __html: svgCode }} />
              <img
                src={imageUrl}
                alt={title}
                className="text-secondary stroke-secondary fill-secondary"
              />
            </div>
          </div>
          {title} - {description}
        </div>
      ))}
    */}
    </div>
  );
}
