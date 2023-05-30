import { useState, useEffect, useRef } from 'react';
import { GutterProps, MousePosition, SiblingInfo, Direction } from './types';
import { getStyleKey, getSiblingSizes } from './utils';

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
        !previousSiblingInfoRef.current.startRect ||
        !nextSiblingInfoRef.current.startRect
      )
        return;

      const styleKey = getStyleKey(direction);

      // calculate new size
      const newPreviousSiblingSizePx =
        previousSiblingInfoRef.current.startRect[styleKey] + moveDistance;
      const newNextSiblingSizePx =
        nextSiblingInfoRef.current.startRect[styleKey] - moveDistance;

      const siblingMinSizes = getSiblingSizes(minItemSizes ?? [], index)
      const previousMinSize = siblingMinSizes[0] ?? 0;
      const nexMinSize = siblingMinSizes[1] ?? 0;

      // set new size
      const newPreviousSizeBiggerMinSize = newPreviousSiblingSizePx >= previousMinSize
      const newNextSizeBiggerMinSize = newNextSiblingSizePx >= nexMinSize
      if (newPreviousSizeBiggerMinSize && newNextSizeBiggerMinSize) {
        callback([newPreviousSiblingSizePx, newNextSiblingSizePx], moveDistance);
      }

      // fix size
      const currentSiblingSizes = getSiblingSizes(itemSizes, index)
      const currentPreviousSiblingSizePx = currentSiblingSizes[0] ?? 0;
      const currentNextSiblingSizePx = currentSiblingSizes[1] ?? 0;
      const needFixPreviousSizePx = (newPreviousSiblingSizePx !== currentPreviousSiblingSizePx &&
        newPreviousSiblingSizePx <= previousMinSize &&
        currentPreviousSiblingSizePx > previousMinSize);
      if (needFixPreviousSizePx) {
        const fixPreviousSizePx = previousMinSize;
        const fixNextSizePx =
          currentNextSiblingSizePx + currentPreviousSiblingSizePx - previousMinSize;
        callback([fixPreviousSizePx, fixNextSizePx], moveDistance);
      }
      const needFixNextSizePx = (newNextSiblingSizePx !== currentNextSiblingSizePx &&
        newNextSiblingSizePx <= nexMinSize &&
        currentNextSiblingSizePx > nexMinSize);
      if (needFixNextSizePx) {
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
      const siblingMinSize = getSiblingSizes(minItemSizes, index)
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
  }, [mouseDown, direction, minItemSizes, itemSizes]);

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
