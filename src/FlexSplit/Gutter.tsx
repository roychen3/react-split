import { useState, useEffect, useRef } from 'react';
import { GutterProps, MousePosition, SiblingInfo, Direction } from './types';
import { getStyleKey, getSiblingSizes } from './utils';

const defaultMousePosition: MousePosition = {
  x: 0,
  y: 0,
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
      callback: (siblingItemSizes: number[], moveDistance: number) => void
    ) => {
      if (
        !gutterRef.current ||
        !(gutterRef.current.parentElement instanceof HTMLElement)
      ) {
        return;
      }

      const currentSiblingSizes = getSiblingSizes(mouseDownItemSizes, index);
      const currentASize = currentSiblingSizes[0] ?? 0;
      const currentBSize = currentSiblingSizes[1] ?? 0;

      // calculate new size
      const newASize = currentASize + moveDistance;
      const newBSize = currentBSize - moveDistance;

      // calculate min size
      const aGutterSize = index === 0 ? size / 2 : size;
      const bGutterSize = index + 2 === itemSizes.length ? size / 2 : size;
      const siblingMinSizes = getSiblingSizes(minItemSizes ?? [], index);
      const aMinSize = (siblingMinSizes[0] ?? 0) + aGutterSize;
      const bMinSize = (siblingMinSizes[1] ?? 0) + bGutterSize;

      // set new size
      const validASize = newASize >= aMinSize;
      const validBSize = newBSize >= bMinSize;
      if (validASize && validBSize) {
        const newSiblingItemSizes = [newASize, newBSize];
        callback(newSiblingItemSizes, moveDistance);
      }

      // fix size
      const needFixASize =
        newASize !== currentASize &&
        newASize <= aMinSize &&
        currentASize > aMinSize;
      if (needFixASize) {
        const fixASizePx = aMinSize;
        const fixBSizePx = currentBSize + currentASize - aMinSize;
        const newSiblingItemSizes = [fixASizePx, fixBSizePx];
        callback(newSiblingItemSizes, moveDistance);
      }
      const needFixBSize =
        newBSize !== currentBSize &&
        newBSize <= bMinSize &&
        currentBSize > bMinSize;
      if (needFixBSize) {
        const fixASizePx = currentASize + currentBSize - bMinSize;
        const fixBSizePx = bMinSize;
        const newSiblingItemSizes = [fixASizePx, fixBSizePx];
        callback(newSiblingItemSizes, moveDistance);
      }
    };
    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      if (direction === 'horizontal') {
        const moveDistance = event.clientX - mouseDownPositionRef.current.x;
        flexMode(moveDistance, (siblingItemSizes) => {
          onGutterMove?.(siblingItemSizes, event);
        });
      }
      if (direction === 'vertical') {
        const moveDistance = event.clientY - mouseDownPositionRef.current.y;
        flexMode(moveDistance, (siblingItemSizes) => {
          onGutterMove?.(siblingItemSizes, event);
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
