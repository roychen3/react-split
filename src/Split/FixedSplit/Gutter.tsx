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
  onGutterDown,
  onGutterMove,
  onGutterUp,
  ...props
}: GutterProps) => {
  const gutterRef = useRef<HTMLDivElement>(null);
  const previousSiblingInfoRef = useRef<SiblingInfo>(defaultSiblingElement);
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
    onGutterDown?.();
  };

  useEffect(() => {
    const fixedMode = (
      moveDistance: number,
      callback: (previousSiblingPixelSize: number) => void
    ) => {
      if (!gutterRef.current || !previousSiblingInfoRef.current.startRect) {
        return;
      }

      const mouseDownPreviousSiblingSize =
        previousSiblingInfoRef.current.startRect[styleKey];
      const newPreviousSiblingSize =
        mouseDownPreviousSiblingSize + moveDistance;
      const siblingMinSize = getSiblingSizes(minItemSizes, index);
      const previousMinPixelSize = siblingMinSize[0] ?? 0;
      const newSizeBiggerMinSize =
        newPreviousSiblingSize >= previousMinPixelSize;

      if (newSizeBiggerMinSize) {
        callback(newPreviousSiblingSize);
      } else {
        callback(previousMinPixelSize);
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      if (direction === 'horizontal') {
        const moveDistance = event.clientX - mouseDownPositionRef.current.x;
        fixedMode(moveDistance, (previousSiblingPixelSize) => {
          onGutterMove?.([previousSiblingPixelSize]);
        });
      }
      if (direction === 'vertical') {
        const moveDistance = event.clientY - mouseDownPositionRef.current.y;
        fixedMode(moveDistance, (previousSiblingPixelSize) => {
          onGutterMove([previousSiblingPixelSize]);
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
  }, [mouseDown, direction, minItemSizes]);

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
      data-testid="split__gutter"
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
