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
  size = 10,
  style,
  direction = 'horizontal',
  minItemSizes,
  itemSizes,
  percentItemSizes,
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
  const styleKey = getStyleKey(direction);
  const [mouseDownItemSizes, setMouseDownItemSizes] = useState<number[]>([]);

  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!gutterRef.current || !gutterRef.current.parentElement) return;
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
    const totalSplitSize =
      gutterRef.current.parentElement.getBoundingClientRect()[styleKey];
    const newItemSizes = percentItemSizes.map((percentSize) => {
      const result =
        ((totalSplitSize - (percentItemSizes.length - 1) * size) *
          percentSize) /
        100;
      return result;
    });
    setMouseDownItemSizes(newItemSizes);
    onGutterDown?.(newItemSizes, event.nativeEvent);
  };

  useEffect(() => {
    const flexMode = (
      moveDistance: number,
      callback: (siblingItemPixelSizes: number[], moveDistance: number) => void
    ) => {
      if (
        !gutterRef.current
        // !previousSiblingInfoRef.current.startRect ||
        // !nextSiblingInfoRef.current.startRect
      ) {
        return;
      }

      const currentSiblingSizes = getSiblingSizes(mouseDownItemSizes, index);
      const currentPreviousSiblingPixelSize = currentSiblingSizes[0] ?? 0;
      const currentNextSiblingPixelSize = currentSiblingSizes[1] ?? 0;

      // calculate new size
      // const newPreviousSiblingPixelSize =
      //   previousSiblingInfoRef.current.startRect[styleKey] + moveDistance;
      // const newNextSiblingPixelSize =
      //   nextSiblingInfoRef.current.startRect[styleKey] - moveDistance;
      const newPreviousSiblingPixelSize =
        currentPreviousSiblingPixelSize + moveDistance;
      const newNextSiblingPixelSize =
        currentNextSiblingPixelSize - moveDistance;

      // calculate min size
      const adjustPreviousGutterMinSize = index === 0 ? size / 2 : size;
      const adjustNextGutterMinSize =
        index + 2 === itemSizes.length ? size / 2 : size;
      const siblingMinSizes = getSiblingSizes(minItemSizes ?? [], index);
      const previousMinPixelSize =
        (siblingMinSizes[0] ?? 0) + adjustPreviousGutterMinSize;
      const nextMinPixelSize =
        (siblingMinSizes[1] ?? 0) + adjustNextGutterMinSize;

      // set new size
      const newPreviousSizeBiggerMinSize =
        newPreviousSiblingPixelSize >= previousMinPixelSize;
      const newNextSizeBiggerMinSize =
        newNextSiblingPixelSize >= nextMinPixelSize;
      if (newPreviousSizeBiggerMinSize && newNextSizeBiggerMinSize) {
        const newSiblingPixelItemSizes = [
          newPreviousSiblingPixelSize,
          newNextSiblingPixelSize,
        ];
        callback(newSiblingPixelItemSizes, moveDistance);
      }

      // fix size
      const needFixPreviousPxSize =
        newPreviousSiblingPixelSize !== currentPreviousSiblingPixelSize &&
        newPreviousSiblingPixelSize <= previousMinPixelSize &&
        currentPreviousSiblingPixelSize > previousMinPixelSize;
      if (needFixPreviousPxSize) {
        const fixPreviousSizePx = previousMinPixelSize;
        const fixNextSizePx =
          currentNextSiblingPixelSize +
          currentPreviousSiblingPixelSize -
          previousMinPixelSize;
        const newSiblingPixelItemSizes = [fixPreviousSizePx, fixNextSizePx];
        callback(newSiblingPixelItemSizes, moveDistance);
      }
      const needFixNextPxSize =
        newNextSiblingPixelSize !== currentNextSiblingPixelSize &&
        newNextSiblingPixelSize <= nextMinPixelSize &&
        currentNextSiblingPixelSize > nextMinPixelSize;
      if (needFixNextPxSize) {
        const fixPreviousSizePx =
          currentPreviousSiblingPixelSize +
          currentNextSiblingPixelSize -
          nextMinPixelSize;
        const fixNextSizePx = nextMinPixelSize;
        const newSiblingPixelItemSizes = [fixPreviousSizePx, fixNextSizePx];
        callback(newSiblingPixelItemSizes, moveDistance);
      }
    };
    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      if (direction === 'horizontal') {
        const moveDistance = event.clientX - mouseDownPositionRef.current.x;
        flexMode(moveDistance, (siblingItemPixelSizes) => {
          onGutterMove?.(siblingItemPixelSizes, event);
        });
      }
      if (direction === 'vertical') {
        const moveDistance = event.clientY - mouseDownPositionRef.current.y;
        flexMode(moveDistance, (siblingItemPixelSizes) => {
          onGutterMove?.(siblingItemPixelSizes, event);
        });
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
      style={{
        ...style,
        [styleKey]: `${size}px`,
      }}
      className={gutterClassName}
      onMouseDown={onMouseDown}
    ></div>
  );
};

export default Gutter;
