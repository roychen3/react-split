import { useState, useEffect, useRef } from 'react';
import { GutterProps, MousePosition, SiblingInfo, Direction } from './types';
import { getStyleKey } from './utils';

const defaultMousePosition: MousePosition = {
  x: 0,
  y: 0,
};
const defaultSiblingElement: SiblingInfo = {
  startRect: null,
  element: null,
};

const Gutter = ({
  direction,
  flexContainer,
  itemSizes,
  onGutterDown,
  onGutterMove,
  onGutterUp,
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

      // set new size
      if (newNextSiblingSizePx >= 0) {
        previousSiblingInfoRef.current.element.style[
          styleKey
        ] = `${newPreviousSiblingSizePx}px`;
      }
      if (newPreviousSiblingSizePx >= 0) {
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
        newNextSiblingSizePx >= 0 &&
        newPreviousSiblingSizePx !== currentPreviousSiblingSizePx &&
        newPreviousSiblingSizePx <= 0 &&
        currentPreviousSiblingSizePx > 0
      ) {
        const fixPreviousSizePx = 0;
        previousSiblingInfoRef.current.element.style[
          styleKey
        ] = `${fixPreviousSizePx}px`;
        const fixNextSizePx =
          currentNextSiblingSizePx + currentPreviousSiblingSizePx;
        nextSiblingInfoRef.current.element.style[
          styleKey
        ] = `${fixNextSizePx}px`;
      }
      if (
        newPreviousSiblingSizePx >= 0 &&
        newNextSiblingSizePx !== currentNextSiblingSizePx &&
        newNextSiblingSizePx <= 0 &&
        currentNextSiblingSizePx > 0
      ) {
        const fixPreviousSizePx =
          currentPreviousSiblingSizePx + currentNextSiblingSizePx;
        previousSiblingInfoRef.current.element.style[
          styleKey
        ] = `${fixPreviousSizePx}px`;
        const fixNextSizePx = 0;
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
      const positive = newPreviousSiblingSizePx > 0;
      const zeroSize =
        previousSiblingInfoRef.current.element.style[styleKey] === '0px';

      if (zeroSize || positive) {
        previousSiblingInfoRef.current.element.style[
          styleKey
        ] = `${newPreviousSiblingSizePx}px`;
      }
      if (!positive) {
        previousSiblingInfoRef.current.element.style[styleKey] = '0';
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
    // if flexContainer, auto fill space
    if (flexContainer && itemSizes.length === 0 && gutterRef.current instanceof HTMLElement) {
      if (gutterRef.current.previousElementSibling instanceof HTMLElement) {
        gutterRef.current.previousElementSibling.style.flex = '1';
      }
      if (gutterRef.current.nextElementSibling instanceof HTMLElement) {
        gutterRef.current.nextElementSibling.style.flex = '1';
      }
    }
  }, [flexContainer]);

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
      ref={gutterRef}
      className={gutterClassName}
      onMouseDown={onMouseDown}
    ></div>
  );
};

export default Gutter;
