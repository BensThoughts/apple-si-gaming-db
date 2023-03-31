interface AppInfoDescriptionCardProps {
  requiredAge?: string | null;
  shortDescription?: string | null;
}

export default function AppInfoDescriptionCard({
  requiredAge,
  shortDescription,
}: AppInfoDescriptionCardProps) {
  return (
    <div className={`hidden md:flex flex-col items-center gap-2 justify-center p-3
                     bg-tertiary
                     rounded-lg max-w-2xl`}>
      {requiredAge &&
        <div>
          Required Age: {requiredAge}
        </div>
      }
      {shortDescription &&
          <div dangerouslySetInnerHTML={{ __html: shortDescription }} />
      }
    </div>
  );
}
