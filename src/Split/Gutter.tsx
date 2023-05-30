import { useState, useEffect, useRef } from 'react';
import { GutterProps, MousePosition, SiblingInfo, Direction } from './types';
import { getStyleKey, getSiblingSize } from './utils';

const defaultMousePosition: MousePosition = {
  x: 0,
  y: 0,
};
const defaultSiblingElement: SiblingInfo = {
  startRect: null,
};

const Gutter = ({
  index,
  direction = 'horizontal',
  flexContainer = true,
  minItemSizes,
  itemSizes,
  onGutterDown,
  onGutterMove,
  onGutterUp,
  ...props
}: GutterProps) => {
  const gutterRef = useRef<HTMLDivElement>(null);
  const previousSiblingInfoRef = useRef<SiblingInfo>(defaultSiblingElement);
  const nextSiblingInfoRef = useRef<SiblingInfo>(defaultSiblingElement);
  const mouseDownPositionRef = useRef<MousePosition>(defaultMousePosition);
  const [mouseDown, setMouseDown] = useState(false);

  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!gutterRef.current) return;

    setMouseDown(true);
    mouseDownPositionRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    if (gutterRef.current.previousSibling instanceof HTMLElement) {
      const rect = gutterRef.current.previousSibling.getBoundingClientRect();
      previousSiblingInfoRef.current = {
        startRect: rect,
      };
    }
    if (gutterRef.current.nextSibling instanceof HTMLElement) {
      const rect = gutterRef.current.nextSibling.getBoundingClientRect();
      nextSiblingInfoRef.current = {
        startRect: rect,
      };
    }
    onGutterDown?.(event.nativeEvent);
  };

  useEffect(() => {
    const flexMode = (moveDistance: number, direction: Direction, callback: (siblingItemSizes: number[], moveDistance: number) => void) => {
      if (
        !gutterRef.current ||
        !gutterRef.current.parentElement ||
        !(gutterRef.current.previousSibling instanceof HTMLElement) ||
        !(gutterRef.current.nextSibling instanceof HTMLElement) ||
        !previousSiblingInfoRef.current.startRect ||
        !nextSiblingInfoRef.current.startRect
      )
        return;

      const styleKey = getStyleKey(direction);
      const previousSiblingElement = gutterRef.current.previousSibling
      const nextSiblingElement = gutterRef.current.nextSibling

      // replace flex to width
      if (previousSiblingElement.style.flex) {
        previousSiblingElement.style[styleKey] = `${previousSiblingElement.getBoundingClientRect()[
          styleKey
        ]
          }px`;
        previousSiblingElement.style.flex = '';
      }
      if (nextSiblingElement.style.flex) {
        nextSiblingElement.style[styleKey] = `${nextSiblingElement.getBoundingClientRect()[styleKey]
          }px`;
        nextSiblingElement.style.flex = '';
      }

      // calculate new size
      const newPreviousSiblingSizePx =
        previousSiblingInfoRef.current.startRect[styleKey] + moveDistance;
      const newNextSiblingSizePx =
        nextSiblingInfoRef.current.startRect[styleKey] - moveDistance;

      const siblingMinSize = getSiblingSize(minItemSizes ?? [], index)
      const previousMinSize = siblingMinSize[0] ?? 0;
      const nexMinSize = siblingMinSize[1] ?? 0;

      // set new size
      if (newPreviousSiblingSizePx >= previousMinSize && newNextSiblingSizePx >= nexMinSize) {
        callback([newPreviousSiblingSizePx, newNextSiblingSizePx], moveDistance);
      }

      // check size & fix size
      const currentPreviousSiblingSizePx =
        previousSiblingElement.getBoundingClientRect()[
        styleKey
        ];
      const currentNextSiblingSizePx =
        nextSiblingElement.getBoundingClientRect()[styleKey];
      if (
        newNextSiblingSizePx >= nexMinSize &&
        newPreviousSiblingSizePx !== currentPreviousSiblingSizePx &&
        newPreviousSiblingSizePx <= previousMinSize &&
        currentPreviousSiblingSizePx > previousMinSize
      ) {
        const fixPreviousSizePx = previousMinSize;
        const fixNextSizePx =
          currentNextSiblingSizePx + currentPreviousSiblingSizePx - previousMinSize;
        callback([fixPreviousSizePx, fixNextSizePx], moveDistance);
      }
      if (
        newPreviousSiblingSizePx >= previousMinSize &&
        newNextSiblingSizePx !== currentNextSiblingSizePx &&
        newNextSiblingSizePx <= nexMinSize &&
        currentNextSiblingSizePx > nexMinSize
      ) {
        const fixPreviousSizePx =
          currentPreviousSiblingSizePx + currentNextSiblingSizePx - nexMinSize;
        const fixNextSizePx = nexMinSize;
        callback([fixPreviousSizePx, fixNextSizePx], moveDistance);
      }
    };
    const fixedMode = (moveDistance: number, direction: Direction, callback: (previousSiblingSizePx: number, moveDistance: number) => void) => {
      if (
        !gutterRef.current ||
        !(gutterRef.current.previousSibling instanceof HTMLElement) ||
        !previousSiblingInfoRef.current.startRect
      ) {
        return;
      }

      const styleKey = getStyleKey(direction);
      const newPreviousSiblingSizePx =
        previousSiblingInfoRef.current.startRect[styleKey] + moveDistance;
      const siblingMinSize = getSiblingSize(minItemSizes ?? [], index)
      const previousMinSize = siblingMinSize[0] ?? 0;
      const newSizeBiggerMinSize = newPreviousSiblingSizePx > previousMinSize;
      const currentPreviousSiblingSizePx = gutterRef.current.previousSibling.getBoundingClientRect()[styleKey]
      const currentSizeBiggerMinSize = currentPreviousSiblingSizePx > previousMinSize;

      if (newSizeBiggerMinSize) {
        gutterRef.current.previousSibling.style[
          styleKey
        ] = `${newPreviousSiblingSizePx}px`;
        callback(newPreviousSiblingSizePx, moveDistance)
      } else if (currentSizeBiggerMinSize) {
        gutterRef.current.previousSibling.style[styleKey] = `${previousMinSize}px`;
        callback(previousMinSize, moveDistance)
      }
    };
    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      if (direction === 'horizontal') {
        const moveDistance = event.clientX - mouseDownPositionRef.current.x;
        if (flexContainer) {
          flexMode(moveDistance, direction, (siblingItemSizes) => { onGutterMove?.(siblingItemSizes, event); });
        } else {
          fixedMode(moveDistance, direction, (previousSiblingSizePx) => { onGutterMove?.([previousSiblingSizePx], event); });
        }
      }
      if (direction === 'vertical') {
        const moveDistance = event.clientY - mouseDownPositionRef.current.y;
        if (flexContainer) {
          flexMode(moveDistance, direction, (siblingItemSizes) => { onGutterMove?.(siblingItemSizes, event); });
        } else {
          fixedMode(moveDistance, direction, (previousSiblingSizePx) => { onGutterMove?.([previousSiblingSizePx], event); });
        }
      }
    };
    const onMouseUp = (event: MouseEvent) => {
      event.preventDefault();
      setMouseDown(false);
      onGutterUp?.(event);
    };

    if (mouseDown) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      if (mouseDown) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
    };
  }, [mouseDown]);

  const getGutterClassName = () => {
    let className = 'gutter';
    if (direction === 'horizontal') {
      className += ' gutter--horizontal';
    }
    if (direction === 'vertical') {
      className += ' gutter--vertical';
    }
    return className;
  };
  const gutterClassName = getGutterClassName();

  return (
    <div
      {...props}
      ref={gutterRef}
      className={gutterClassName}
      onMouseDown={onMouseDown}
    ></div>
  );
};

export default Gutter;
