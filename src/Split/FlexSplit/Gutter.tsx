import { useState, useEffect, useRef } from 'react';
import { GutterProps, MousePosition } from './types';
import { getStyleKey, getSiblingSizes } from './utils';

// a: gutter pervious sibling element
// b: gutter next sibling element

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
  const [mouseDownItemSizes, setMouseDownItemSizes] = useState<number[]>([]);
  const styleKey = getStyleKey(direction);

  const onMouseDown = (event: React.MouseEvent) => {
    if (!gutterRef.current || !gutterRef.current.parentElement) return;

    event.preventDefault();
    setMouseDown(true);
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
    onGutterDown?.(newItemSizes);
    mouseDownPositionRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  useEffect(() => {
    const flexMode = (
      moveDistance: number,
      callback: (siblingItemSizes: number[]) => void
    ) => {
      if (!gutterRef.current) {
        return;
      }

      const startSiblingSizes = getSiblingSizes(mouseDownItemSizes, index);
      if (!startSiblingSizes[0] || !startSiblingSizes[1]) return;
      const startASize = startSiblingSizes[0];
      const startBSize = startSiblingSizes[1];

      // calculate new size
      const newASize = startASize + moveDistance;
      const newBSize = startBSize - moveDistance;

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
        callback(newSiblingItemSizes);
      }

      // fix size
      const currentASize = itemSizes[index];
      const currentBSize = itemSizes[index + 1];
      const needFixASize =
        newASize !== currentASize &&
        newASize <= aMinSize &&
        currentASize > aMinSize;
      if (needFixASize) {
        const totalSplitItemSize = itemSizes.reduce(
          (accumulator, size) => accumulator + size,
          0
        );
        const totalSplitSize =
          totalSplitItemSize + size * (itemSizes.length - 1);
        const windowAMinPercent =
          ((siblingMinSizes[0] ?? 0) + aGutterSize) / totalSplitSize;
        const windowAMinSize = totalSplitItemSize * windowAMinPercent;

        const fixASizePx = windowAMinSize;
        const fixBSizePx = currentBSize + currentASize - windowAMinSize;
        const newSiblingItemSizes = [fixASizePx, fixBSizePx];
        callback(newSiblingItemSizes);
      }
      const needFixBSize =
        newBSize !== currentBSize &&
        newBSize <= bMinSize &&
        currentBSize > bMinSize;
      if (needFixBSize) {
        const totalSplitItemSize = itemSizes.reduce(
          (accumulator, size) => accumulator + size,
          0
        );
        const totalSplitSize =
          totalSplitItemSize + size * (itemSizes.length - 1);
        const windowBMinPercent =
          ((siblingMinSizes[1] ?? 0) + bGutterSize) / totalSplitSize;
        const windowBMinSize = totalSplitItemSize * windowBMinPercent;

        const fixASizePx = currentASize + currentBSize - windowBMinSize;
        const fixBSizePx = windowBMinSize;
        const newSiblingItemSizes = [fixASizePx, fixBSizePx];
        callback(newSiblingItemSizes);
      }
    };
    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      if (direction === 'horizontal') {
        const moveDistance = event.clientX - mouseDownPositionRef.current.x;
        flexMode(moveDistance, (siblingItemSizes) => {
          onGutterMove?.(siblingItemSizes);
        });
      }
      if (direction === 'vertical') {
        const moveDistance = event.clientY - mouseDownPositionRef.current.y;
        flexMode(moveDistance, (siblingItemSizes) => {
          onGutterMove?.(siblingItemSizes);
        });
      }
    };
    const onMouseUp = (event: MouseEvent) => {
      event.preventDefault();
      setMouseDown(false);
      onGutterUp?.();
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
  }, [mouseDown, direction, mouseDownItemSizes, minItemSizes, itemSizes]);

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
