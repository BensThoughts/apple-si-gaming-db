import DOMPurify from 'isomorphic-dompurify';
import { classNames } from '~/lib/css/classNames';

export default function HTMLContainer({
  htmlString,
}: {
  htmlString: string;
}) {
  return (
    // <p className="text-primary-highlight">
    //   {htmlString}
    // </p>
    <div
      className={classNames(
          'prose prose-slate dark:prose-invert prose-p:my-0',
          'prose-headings:mb-4 prose-headings:mt-2',
          '[&_h1]:text-2xl [&_h2]:text-xl',
          '[&_s]:line-through [&_u]:underline',
          'whitespace-pre-wrap',
      )}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(htmlString), // TODO: is this computationally intensive?
      }}
    />
  );
}
