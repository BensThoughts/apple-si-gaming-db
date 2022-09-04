import AppInfoDisclosure from './AppInfoDisclosure';

export default function AppInfoRequirements({
  macRequirementsMinimum,
  macRequirementsRecommended,
}: {
  macRequirementsMinimum?: string | null;
  macRequirementsRecommended?: string | null;
}) {
  return (
    <AppInfoDisclosure title="Requirements">
      <div className="flex gap-3">
        {macRequirementsMinimum &&
        <div dangerouslySetInnerHTML={{ __html: macRequirementsMinimum }} />
        }
        {macRequirementsRecommended &&
        <div dangerouslySetInnerHTML={{ __html: macRequirementsRecommended }} />
        }
      </div>
    </AppInfoDisclosure>
  );
};
