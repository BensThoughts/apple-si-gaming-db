import { InformationCircle } from '~/components/Icons';

export default function AsideInfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <aside className={`relative px-6 py-8 border-l-[3px] border-solid bg-primary border-secondary
                       rounded-tr-[6px] rounded-tl-[3px] rounded-br-[6px] rounded-bl-[6px] mt-2`}>
      <div className="rounded-[50%] absolute top-0 left-0 bg-app-bg w-[40px] h-[40px] -translate-x-[18.5px] -translate-y-[50%]">
        <InformationCircle className="text-icon-secondary absolute top-0 left-0 w-8 h-8" />
      </div>
      <strong className="font-bold">{title}</strong>
      <div>{children}</div>
    </aside>
  );
}
