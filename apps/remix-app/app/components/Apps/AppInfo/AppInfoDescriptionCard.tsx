interface AppInfoDescriptionCardProps {
  requiredAge?: string | null;
  shortDescription?: string | null;
}

export default function AppInfoDescriptionCard({
  requiredAge,
  shortDescription,
}: AppInfoDescriptionCardProps) {
  if (!shortDescription) {
    return null;
  }
  return (
    <div
      className="flex flex-col items-center gap-2 justify-center p-3
                 bg-tertiary rounded-lg max-w-2xl"
    >
      {requiredAge &&
        <div>
          Required Age: {requiredAge}
        </div>
      }
      {/* Probably don't need dangerouslySetInnerHTML, shortDescription always seems
      to be a string. */}
      {shortDescription &&
          <div dangerouslySetInnerHTML={{ __html: shortDescription }} />
      }
    </div>
  );
}
