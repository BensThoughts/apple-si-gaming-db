import { useState } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { usePopper } from 'react-popper';
import { classNames } from '~/lib/css/classNames';

type ButtonWithTooltipProps = {
  tooltipText: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function ButtonWithTooltip({
  className,
  children,
  tooltipText,
  ...rest
}: ButtonWithTooltipProps) {
  const [isShowingTooltip, setIsShowingTooltip] = useState(false);
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom',
    modifiers: [
      {
        name: 'arrow',
        options: { element: arrowElement, padding: 5 },
      },
      {
        name: 'offset',
        options: {
          offset: [0, 10],
        },
      },
    ],
  });
  return (
    <>
      <button
        ref={setReferenceElement}
        className={className}
        onMouseEnter={() => setIsShowingTooltip(true)}
        onMouseLeave={() => setIsShowingTooltip(false)}
        onFocus={() => setIsShowingTooltip(true)}
        onBlur={() => setIsShowingTooltip(false)}
        {...rest}
      >
        {children}
      </button>
      <div
        ref={setPopperElement}
        style={styles.popper}
        className={classNames(
            'bg-secondary rounded-md py-1 px-2 group',
            isShowingTooltip ? 'visible' : 'invisible',
        )}
        id="tooltip"
        role="tooltip"
        {...attributes.popper}
      >
        {tooltipText}
        <div
          ref={setArrowElement}
          style={{ ...styles.arrow }}
          id="arrow"
          data-popper-arrow
          className={classNames(
              'w-[10px] h-[10px] invisible',
              'before:absolute before:w-[10px] before:h-[10px] before:bg-secondary',
              // 'before:bottom-6',
              'group-data-[popper-placement^="top"]:before:bottom-[2px]',
              'group-data-[popper-placement^="bottom"]:before:-top-[32px]',
              'before:visible before:content-[""] before:rotate-45',
              isShowingTooltip ? 'before:visible' : 'before:invisible',
          )}
        />
      </div>
    </>
  );
}
