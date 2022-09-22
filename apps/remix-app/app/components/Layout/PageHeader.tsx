export default function PageHeader({
  title,
  titlePosition,
}: {
  title: string;
  titlePosition: 'left' | 'center';
}) {
  return (
    <div className="w-full min-h-[2rem] bg-primary py-2 px-6 mb-4 md:mb-8">
      <h1 className={`text-2xl md:text-3xl text-secondary
                      ${titlePosition === 'left' ? 'text-left' : 'text-center'}`}>
        {title}
      </h1>
    </div>
  );
}
