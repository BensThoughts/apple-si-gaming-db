interface MainAppCardProps {
  requiredAge?: string | null;
  shortDescription?: string | null;
}

export default function MainAppCard({
  requiredAge,
  shortDescription,
}: MainAppCardProps) {
  return (
    <div className={`flex flex-col items-center gap-2 justify-center p-3
                     bg-tertiary border-secondary border-solid border-1
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
