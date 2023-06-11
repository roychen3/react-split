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
  getSplitItemsMap,
  onGutterDown,
  onGutterMove,
  onGutterUp,
  ...props
}: GutterProps) => {
  const gutterRef = useRef<HTMLDivElement>(null);
  const mouseDownPositionRef = useRef<MousePosition>(defaultMousePosition);
  const marginRef = useRef({ a: 0 });
  const sectionSizeRef = useRef(0);
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseDownItemSizes, setMouseDownItemSizes] = useState<number[]>([]);
  const styleKey = getStyleKey(direction);

  const onMouseDown = (event: React.MouseEvent) => {
    if (
      !gutterRef.current ||
      !gutterRef.current.parentElement ||
      !(gutterRef.current.previousSibling instanceof HTMLElement) ||
      !(gutterRef.current.nextSibling instanceof HTMLElement)
    )
      return;

    event.preventDefault();
    setMouseDown(true);
    const splitItemsMap = getSplitItemsMap();
    const splitItemElements = Array.from(splitItemsMap).map((item) => item[1]);
    const splitItemRects = splitItemElements.map((splitItemElement) => {
      return splitItemElement.getBoundingClientRect();
    });
    const newItemSizes = splitItemRects.map((rect) => {
      return rect[styleKey];
    });
    setMouseDownItemSizes(newItemSizes);
    onGutterDown?.(newItemSizes);
    marginRef.current = {
      a:
        direction === 'horizontal'
          ? event.clientX - gutterRef.current.getBoundingClientRect().left
          : event.clientY - gutterRef.current.getBoundingClientRect().top,
    };
    sectionSizeRef.current =
      direction === 'horizontal'
        ? gutterRef.current.nextSibling.getBoundingClientRect().right -
          gutterRef.current.previousSibling.getBoundingClientRect().left
        : gutterRef.current.nextSibling.getBoundingClientRect().bottom -
          gutterRef.current.previousSibling.getBoundingClientRect().top;
    mouseDownPositionRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  useEffect(() => {
    const flexMode = (
      currentPosition: number,
      callback: (siblingItemSizes: number[]) => void
    ) => {
      if (
        !gutterRef.current ||
        !(gutterRef.current.previousSibling instanceof HTMLElement)
      ) {
        return;
      }

      // calculate new size
      const calculateGutterPosition =
        direction === 'horizontal'
          ? gutterRef.current.previousSibling.getBoundingClientRect().left
          : gutterRef.current.previousSibling.getBoundingClientRect().top;
      const newASize =
        currentPosition - calculateGutterPosition - marginRef.current.a;
      const newBSize =
        sectionSizeRef.current -
        newASize -
        gutterRef.current.getBoundingClientRect()[styleKey];

      // calculate min size
      const siblingMinSizes = getSiblingSizes(minItemSizes ?? [], index);
      const aMinSize = siblingMinSizes[0] ?? 0;
      const bMinSize = siblingMinSizes[1] ?? 0;

      // set new size
      const validASize = newASize >= aMinSize;
      const validBSize = newBSize >= bMinSize;
      if (validASize && validBSize) {
        const newSiblingItemSizes = [newASize, newBSize];
        callback(newSiblingItemSizes);
      } else {
        // fix size
        if (!validASize) {
          const fixBSize =
            sectionSizeRef.current -
            aMinSize -
            gutterRef.current.getBoundingClientRect()[styleKey];
          const newSiblingItemSizes = [aMinSize, fixBSize];
          callback(newSiblingItemSizes);
        }
        if (!validBSize) {
          const fixASize =
            sectionSizeRef.current -
            bMinSize -
            gutterRef.current.getBoundingClientRect()[styleKey];
          const newSiblingItemSizes = [fixASize, bMinSize];
          callback(newSiblingItemSizes);
        }
      }
    };
    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      if (direction === 'horizontal') {
        flexMode(event.clientX, (siblingItemSizes) => {
          onGutterMove?.(siblingItemSizes);
        });
      }
      if (direction === 'vertical') {
        flexMode(event.clientY, (siblingItemSizes) => {
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
