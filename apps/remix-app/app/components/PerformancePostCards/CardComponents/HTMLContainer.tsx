import DOMPurify from 'isomorphic-dompurify';

export default function HTMLContainer({
  htmlString,
}: {
  htmlString: string;
}) {
  return (
    // <p className="text-primary-highlight">
    //   {htmlString}
    // </p>
    <div dangerouslySetInnerHTML={{
      __html: DOMPurify.sanitize(htmlString),
    }} />
  );
}
