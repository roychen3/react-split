import { useState, useEffect, useRef } from 'react';
import { GutterProps, MousePosition, SiblingInfo, Direction } from './types';
import { getStyleKey, getSiblingSize, formatSize } from './utils';

const defaultMousePosition: MousePosition = {
  x: 0,
  y: 0,
};
const defaultSiblingElement: SiblingInfo = {
  startRect: null,
  element: null,
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
        element: gutterRef.current.previousSibling,
      };
    }
    if (gutterRef.current.nextSibling instanceof HTMLElement) {
      const rect = gutterRef.current.nextSibling.getBoundingClientRect();
      nextSiblingInfoRef.current = {
        startRect: rect,
        element: gutterRef.current.nextSibling,
      };
    }
    onGutterDown?.(event.nativeEvent);
  };

  useEffect(() => {
    const flexMode = (moveDistance: number, direction: Direction) => {
      if (
        !gutterRef.current ||
        !gutterRef.current.parentElement ||
        !previousSiblingInfoRef.current.element ||
        !previousSiblingInfoRef.current.startRect ||
        !nextSiblingInfoRef.current.element ||
        !nextSiblingInfoRef.current.startRect
      )
        return;

      const styleKey = getStyleKey(direction);

      // replace flex to width
      if (previousSiblingInfoRef.current.element.style.flex) {
        previousSiblingInfoRef.current.element.style[styleKey] = `${previousSiblingInfoRef.current.element.getBoundingClientRect()[
          styleKey
        ]
          }px`;
        previousSiblingInfoRef.current.element.style.flex = '';
      }
      if (nextSiblingInfoRef.current.element.style.flex) {
        nextSiblingInfoRef.current.element.style[styleKey] = `${nextSiblingInfoRef.current.element.getBoundingClientRect()[styleKey]
          }px`;
        nextSiblingInfoRef.current.element.style.flex = '';
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
        previousSiblingInfoRef.current.element.style[
          styleKey
        ] = `${newPreviousSiblingSizePx}px`;

        nextSiblingInfoRef.current.element.style[
          styleKey
        ] = `${newNextSiblingSizePx}px`;
      }

      // check size & fix size
      const currentPreviousSiblingSizePx =
        previousSiblingInfoRef.current.element.getBoundingClientRect()[
        styleKey
        ];
      const currentNextSiblingSizePx =
        nextSiblingInfoRef.current.element.getBoundingClientRect()[styleKey];
      if (
        newNextSiblingSizePx >= nexMinSize &&
        newPreviousSiblingSizePx !== currentPreviousSiblingSizePx &&
        newPreviousSiblingSizePx <= previousMinSize &&
        currentPreviousSiblingSizePx > previousMinSize
      ) {
        const fixPreviousSizePx = previousMinSize;
        previousSiblingInfoRef.current.element.style[
          styleKey
        ] = `${fixPreviousSizePx}px`;
        const fixNextSizePx =
          currentNextSiblingSizePx + currentPreviousSiblingSizePx - previousMinSize;
        nextSiblingInfoRef.current.element.style[
          styleKey
        ] = `${fixNextSizePx}px`;
      }
      if (
        newPreviousSiblingSizePx >= previousMinSize &&
        newNextSiblingSizePx !== currentNextSiblingSizePx &&
        newNextSiblingSizePx <= nexMinSize &&
        currentNextSiblingSizePx > nexMinSize
      ) {
        const fixPreviousSizePx =
          currentPreviousSiblingSizePx + currentNextSiblingSizePx - nexMinSize;
        previousSiblingInfoRef.current.element.style[
          styleKey
        ] = `${fixPreviousSizePx}px`;
        const fixNextSizePx = nexMinSize;
        nextSiblingInfoRef.current.element.style[
          styleKey
        ] = `${fixNextSizePx}px`;
      }
    };
    const fixedMode = (moveDistance: number, direction: Direction) => {
      if (
        !gutterRef.current ||
        !gutterRef.current.parentElement ||
        !previousSiblingInfoRef.current.element ||
        !previousSiblingInfoRef.current.startRect
      )
        return;

      const styleKey = getStyleKey(direction);
      const newPreviousSiblingSizePx =
        previousSiblingInfoRef.current.startRect[styleKey] + moveDistance;
      const siblingMinSize = getSiblingSize(minItemSizes ?? [], index)
      const previousMinSize = siblingMinSize[0] ?? 0;
      const biggerMinSize = newPreviousSiblingSizePx > previousMinSize;

      const equalMinSize =
        previousSiblingInfoRef.current.element.getBoundingClientRect()[styleKey] === previousMinSize;

      if (equalMinSize || biggerMinSize) {
        previousSiblingInfoRef.current.element.style[
          styleKey
        ] = `${newPreviousSiblingSizePx}px`;
      }
      if (!biggerMinSize) {
        previousSiblingInfoRef.current.element.style[styleKey] = `${previousMinSize}px`;
      }
    };
    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      if (direction === 'horizontal') {
        const moveDistance = event.clientX - mouseDownPositionRef.current.x;
        if (flexContainer) {
          flexMode(moveDistance, direction);
        } else {
          fixedMode(moveDistance, direction);
        }
      }
      if (direction === 'vertical') {
        const moveDistance = event.clientY - mouseDownPositionRef.current.y;
        if (flexContainer) {
          flexMode(moveDistance, direction);
        } else {
          fixedMode(moveDistance, direction);
        }
      }
      onGutterMove?.(event);
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

  useEffect(() => {
    if (gutterRef.current instanceof HTMLElement) {
      const [defaultMinPreviousSize, defaultMinNextSize] = getSiblingSize(minItemSizes ?? [], index);
      const [defaultPreviousSize, defaultNextSize] = getSiblingSize(itemSizes ?? [], index);
      const previousSize = formatSize(defaultMinPreviousSize, defaultPreviousSize)
      const nextSize = formatSize(defaultMinNextSize, defaultNextSize)
      const styleKey = getStyleKey(direction);

      if (gutterRef.current.previousElementSibling instanceof HTMLElement) {
        const previousElementSibling = gutterRef.current.previousElementSibling
        if (typeof previousSize === 'number') {
          // set default size
          previousElementSibling.style[styleKey] = `${previousSize}px`
          previousElementSibling.style.flex = '';
        } else if (flexContainer) {
          // else if flexContainer, auto fill space
          previousElementSibling.style.flex = '1';
        }
      }

      if (gutterRef.current.nextElementSibling instanceof HTMLElement) {
        const nextElementSibling = gutterRef.current.nextElementSibling
        if (typeof nextSize === 'number') {
          // set default size
          nextElementSibling.style[styleKey] = `${nextSize}px`
          nextElementSibling.style.flex = '';
        } else if (flexContainer) {
          // else if flexContainer, auto fill space
          nextElementSibling.style.flex = '1';
        }
      }
    }
  }, [direction, minItemSizes, itemSizes, flexContainer]);

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
