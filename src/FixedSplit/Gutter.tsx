import { useState, useEffect, useRef } from 'react';
import { GutterProps, MousePosition, SiblingInfo } from './types';
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
    const fixedMode = (
      moveDistance: number,
      callback: (previousSiblingPixelSize: number, moveDistance: number) => void
    ) => {
      if (
        !gutterRef.current ||
        !(gutterRef.current.previousSibling instanceof HTMLElement) ||
        !previousSiblingInfoRef.current.startRect
      ) {
        return;
      }

      const newPreviousSiblingPixelSize =
        previousSiblingInfoRef.current.startRect[styleKey] + moveDistance;
      const siblingMinSize = getSiblingSizes(minItemSizes, index);
      const previousMinPixelSize = siblingMinSize[0] ?? 0;
      const newSizeBiggerMinSize =
        newPreviousSiblingPixelSize > previousMinPixelSize;
      const currentPreviousSiblingPixelSize =
        gutterRef.current.previousSibling.getBoundingClientRect()[styleKey];
      const currentSizeBiggerMinSize =
        currentPreviousSiblingPixelSize > previousMinPixelSize;

      if (newSizeBiggerMinSize) {
        gutterRef.current.previousSibling.style[
          styleKey
        ] = `${newPreviousSiblingPixelSize}px`;
        callback(newPreviousSiblingPixelSize, moveDistance);
      } else if (currentSizeBiggerMinSize) {
        gutterRef.current.previousSibling.style[
          styleKey
        ] = `${previousMinPixelSize}px`;
        callback(previousMinPixelSize, moveDistance);
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      if (direction === 'horizontal') {
        const moveDistance = event.clientX - mouseDownPositionRef.current.x;
        fixedMode(moveDistance, (previousSiblingPixelSize, moveDistance) => {
          onGutterMove?.({
            newSiblingSizes: [previousSiblingPixelSize],
            moveDistance,
            event,
          });
        });
      }
      if (direction === 'vertical') {
        const moveDistance = event.clientY - mouseDownPositionRef.current.y;
        fixedMode(moveDistance, (previousSiblingPixelSize, moveDistance) => {
          onGutterMove?.({
            newSiblingSizes: [previousSiblingPixelSize],
            moveDistance,
            event,
          });
        });
      }
    };
    const onMouseUp = (event: MouseEvent) => {
      event.preventDefault();
      const moveDistance =
        direction === 'horizontal'
          ? event.clientX - mouseDownPositionRef.current.x
          : event.clientY - mouseDownPositionRef.current.y;
      setMouseDown(false);
      onGutterUp?.({ moveDistance, event });
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
