interface MainAppCardProps {
  type?: string | null;
  requiredAge?: string | null;
  controllerSupport?: string | null;
  shortDescription?: string | null;
  releaseDate?: string | null;
}

export default function MainAppCard({
  type,
  requiredAge,
  controllerSupport,
  shortDescription,
  releaseDate,
}: MainAppCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 justify-center p-3 bg-primary border-secondary border-solid border-2 rounded-md max-w-2xl">
      <div>
        Type: {type}
      </div>
      <div>
        <i className="italic">Released: </i>{releaseDate}
      </div>
      {controllerSupport &&
        <div>
          Controller Support: {controllerSupport}
        </div>
      }
      {requiredAge &&
        <div>
          Required Age: {requiredAge}
        </div>
      }
      {shortDescription &&
        <div>
          <h3>
            Description:
          </h3>
          <div dangerouslySetInnerHTML={{ __html: shortDescription }} />
        </div>
      }
    </div>
  );
}
