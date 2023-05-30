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
    const flexMode = (
      moveDistance: number,
      direction: Direction,
      callback: (siblingItemSizes: number[], moveDistance: number) => void
    ) => {
      if (
        !gutterRef.current ||
        !previousSiblingInfoRef.current.startRect ||
        !nextSiblingInfoRef.current.startRect
      )
        return;

      const styleKey = getStyleKey(direction);

      // calculate new size
      const newPreviousSiblingPxSize =
        previousSiblingInfoRef.current.startRect[styleKey] + moveDistance;
      const newNextSiblingPxSize =
        nextSiblingInfoRef.current.startRect[styleKey] - moveDistance;

      const siblingMinSizes = getSiblingSizes(minItemSizes ?? [], index);
      const previousMinSize = siblingMinSizes[0] ?? 0;
      const nexMinSize = siblingMinSizes[1] ?? 0;

      // set new size
      const newPreviousSizeBiggerMinSize =
        newPreviousSiblingPxSize >= previousMinSize;
      const newNextSizeBiggerMinSize = newNextSiblingPxSize >= nexMinSize;
      if (newPreviousSizeBiggerMinSize && newNextSizeBiggerMinSize) {
        callback(
          [newPreviousSiblingPxSize, newNextSiblingPxSize],
          moveDistance
        );
      }

      // fix size
      const currentSiblingSizes = getSiblingSizes(itemSizes, index);
      const currentPreviousSiblingPxSize = currentSiblingSizes[0] ?? 0;
      const currentNextSiblingPxSize = currentSiblingSizes[1] ?? 0;
      const needFixPreviousPxSize =
        newPreviousSiblingPxSize !== currentPreviousSiblingPxSize &&
        newPreviousSiblingPxSize <= previousMinSize &&
        currentPreviousSiblingPxSize > previousMinSize;
      if (needFixPreviousPxSize) {
        const fixPreviousSizePx = previousMinSize;
        const fixNextSizePx =
          currentNextSiblingPxSize +
          currentPreviousSiblingPxSize -
          previousMinSize;
        callback([fixPreviousSizePx, fixNextSizePx], moveDistance);
      }
      const needFixNextPxSize =
        newNextSiblingPxSize !== currentNextSiblingPxSize &&
        newNextSiblingPxSize <= nexMinSize &&
        currentNextSiblingPxSize > nexMinSize;
      if (needFixNextPxSize) {
        const fixPreviousSizePx =
          currentPreviousSiblingPxSize + currentNextSiblingPxSize - nexMinSize;
        const fixNextSizePx = nexMinSize;
        callback([fixPreviousSizePx, fixNextSizePx], moveDistance);
      }
    };
    const fixedMode = (
      moveDistance: number,
      direction: Direction,
      callback: (previousSiblingSizePx: number, moveDistance: number) => void
    ) => {
      if (
        !gutterRef.current ||
        !(gutterRef.current.previousSibling instanceof HTMLElement) ||
        !previousSiblingInfoRef.current.startRect
      ) {
        return;
      }

      const styleKey = getStyleKey(direction);
      const newPreviousSiblingPxSize =
        previousSiblingInfoRef.current.startRect[styleKey] + moveDistance;
      const siblingMinSize = getSiblingSizes(minItemSizes, index);
      const previousMinSize = siblingMinSize[0] ?? 0;
      const newSizeBiggerMinSize = newPreviousSiblingPxSize > previousMinSize;
      const currentPreviousSiblingPxSize =
        gutterRef.current.previousSibling.getBoundingClientRect()[styleKey];
      const currentSizeBiggerMinSize =
        currentPreviousSiblingPxSize > previousMinSize;

      if (newSizeBiggerMinSize) {
        gutterRef.current.previousSibling.style[
          styleKey
        ] = `${newPreviousSiblingPxSize}px`;
        callback(newPreviousSiblingPxSize, moveDistance);
      } else if (currentSizeBiggerMinSize) {
        gutterRef.current.previousSibling.style[
          styleKey
        ] = `${previousMinSize}px`;
        callback(previousMinSize, moveDistance);
      }
    };
    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      if (direction === 'horizontal') {
        const moveDistance = event.clientX - mouseDownPositionRef.current.x;
        if (flexContainer) {
          flexMode(moveDistance, direction, (siblingItemSizes) => {
            onGutterMove?.(siblingItemSizes, event);
          });
        } else {
          fixedMode(moveDistance, direction, (previousSiblingSizePx) => {
            onGutterMove?.([previousSiblingSizePx], event);
          });
        }
      }
      if (direction === 'vertical') {
        const moveDistance = event.clientY - mouseDownPositionRef.current.y;
        if (flexContainer) {
          flexMode(moveDistance, direction, (siblingItemSizes) => {
            onGutterMove?.(siblingItemSizes, event);
          });
        } else {
          fixedMode(moveDistance, direction, (previousSiblingSizePx) => {
            onGutterMove?.([previousSiblingSizePx], event);
          });
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
