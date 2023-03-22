
export default function CreateSystemInstructions() {
  return (
    // <AsideCard title="How To Create a System" iconBackground="bg-tertiary">
    <div className="flex flex-col gap-3 text-sm">
      <div>
          Copy and paste your system information directly from Steam
          to create a system
      </div>
      <ul className="list-disc ml-6">
        <li>
            In Steam go to the help menu
        </li>
        <li>
            Select "System Information"
        </li>
        <li>
            Right click and select "copy all text to clipboard"
        </li>
        <li>
            Paste that into the System Information field
        </li>
      </ul>
    </div>
    // </AsideCard>
  );
}
