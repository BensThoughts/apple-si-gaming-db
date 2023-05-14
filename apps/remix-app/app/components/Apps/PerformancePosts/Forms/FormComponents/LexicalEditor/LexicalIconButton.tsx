import type { ComponentProps } from 'react';
import type { BaseSvgIconProps } from '~/components/Icons/BaseSvgIcon';
import { BoldIcon, ItalicIcon, UnderlineIcon } from '~/components/Icons/FeatherIcons';
import { StrikethroughIcon, HeadingTwoIcon, HeadingOneIcon, ListIcon, ListOrderedIcon } from '~/components/Icons/Lucide';
import { classNames } from '~/lib/css/classNames';

type IconType =
  | 'bold'
  | 'code'
  | 'copy'
  | 'italic'
  | 'link'
  | 'underline'
  | 'strike'
  | 'check'
  | 'trash'
  | 'clear'
  | 'headingOne'
  | 'headingTwo'
  | 'list'
  | 'listOrdered';

type IconButtonProps = {
  active?: boolean;
  icon?: IconType;
} & ComponentProps<'button'>;

export function IconButton({
  icon,
  active,
  className,
  ...props
}: IconButtonProps) {
  if (!icon) return null;
  const Icon = IconLibrary[icon];

  return (
    <button
      {...props}
      type="button"
      className={classNames(
          `py-[1px] px-1 rounded-md focus:outline-none focus-visible:show-ring-tertiary-highlight`,
          props.disabled
            ? `bg-primary text-primary-faded`
            : active
              ? `bg-primary-highlight border-1 border-secondary-highlight text-primary hover:text-primary-highlight cursor-pointer`
              : `bg-primary border-1 border-transparent text-primary hover:bg-primary-highlight hover:text-primary-highlight cursor-pointer`
          ,
        className ? className : '',
      )}
    >
      <Icon className="w-7 h-7 stroke-1 stroke-text-primary-highlight" />
    </button>
  );
}

const IconLibrary: Record<IconType, React.ComponentType<BaseSvgIconProps>> = {
  bold: ({ ...rest }) => (
    <BoldIcon {...rest} />
  ),
  check: () => (
    <svg
      viewBox="0 0 20 20"
      focusable="false"
      role="img"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="w-7 h-7"
    >
      <title>Check</title>
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
        clipRule="evenodd"
      ></path>
    </svg>
  ),
  code: () =>(
    <svg
      viewBox="0 0 16 16"
      focusable="false"
      role="img"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="w-7 h-7"
    >
      <title>Inline Code</title>
      <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"></path>
    </svg>
  ),
  copy: () => (
    <svg
      viewBox="0 0 24 24"
      focusable="false"
      role="img"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="w-7 h-7"
    >
      <title>Copy</title>
      <path d="M20 2H10c-1.103 0-2 .897-2 2v4H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2v-4h4c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM4 20V10h10l.002 10H4zm16-6h-4v-4c0-1.103-.897-2-2-2h-4V4h10v10z"></path>
    </svg>
  ),
  headingOne: ({ ...rest }) => (
    <HeadingOneIcon {...rest} />
  ),
  headingTwo: ({ ...rest }) => (
    <HeadingTwoIcon {...rest} />
  ),
  italic: ({ ...rest }) => (
    <ItalicIcon {...rest} />
  ),
  link: () => (
    <svg
      viewBox="0 0 24 24"
      focusable="false"
      role="img"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[18px] h-[18px]"
    >
      <title>Link</title>
      <path d="m17.657 14.828-1.414-1.414L17.657 12A4 4 0 1 0 12 6.343l-1.414 1.414-1.414-1.414 1.414-1.414a6 6 0 0 1 8.485 8.485l-1.414 1.414zm-2.829 2.829-1.414 1.414a6 6 0 1 1-8.485-8.485l1.414-1.414 1.414 1.414L6.343 12A4 4 0 1 0 12 17.657l1.414-1.414 1.414 1.414zm0-9.9 1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z"></path>
    </svg>
  ),
  list: ({ ...rest }) => (
    <ListIcon {...rest} />
  ),
  listOrdered: ({ ...rest }) => (
    <ListOrderedIcon {...rest} />
  ),
  underline: ({ ...rest }) => (
    <UnderlineIcon {...rest} />
  ),
  strike: ({ ...rest }) => (
    <StrikethroughIcon {...rest} />
  ),
  trash: () => (
    <svg
      viewBox="0 0 24 24"
      focusable="false"
      role="img"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-7 h-7"
      stroke="currentColor"
    >
      <title>Trash</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m19 7-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"
      ></path>
    </svg>
  ),
  clear: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-7 h-7 stroke-1"
    >
      <title>Clear</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z"
      />
    </svg>
  ),
};
