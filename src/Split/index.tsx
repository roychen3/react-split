import { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import Gutter from './Gutter';
import { SplitProps } from './types';
import {
  formatItemSizes,
  checkSizeRange,
  getStyleKey,
  toPercent,
} from './utils';
import './styles.css';

const Split = ({
  children,
  direction = 'horizontal',
  flexContainer = true,
  minItemSizes: outsideMinItemSizes = [],
  // itemSizes: outsideItemSizes,
  gutterSize = 10,
  gutterStyle,
  onGutterDown,
  onGutterMove,
  onGutterUp,
  ...props
}: SplitProps) => {
  const getSplitClassName = (): string => {
    let className = 'split';
    if (direction === 'horizontal') {
      className += ' split--horizontal';
      if (flexContainer) {
        className += ' split--flex-container';
      }
    }

    if (direction === 'vertical') {
      className += ' split--vertical';
      if (flexContainer) {
        className += ' split--flex-container';
      }
    }

    return className;
  };
  const splitClassName = getSplitClassName();

  if (children instanceof Array) {
    const minItemSizes = formatItemSizes(outsideMinItemSizes, children.length);
    const [innerItemSizes, setInnerItemSizes] = useState<number[]>([]);
    const [percentStringItemSizes, setPercentStringItemSizes] = useState<
      string[]
    >([]);
    const itemSizes = innerItemSizes;
    const styleKey = getStyleKey(direction);
    const splitRef = useRef<HTMLDivElement>(null);

    const updateItemSizes = useCallback((pixelItemSizes: number[]) => {
      if (!splitRef.current) return;

      setInnerItemSizes(pixelItemSizes)
      const totalPixelItemSize = pixelItemSizes.reduce(
        (accumulator, a) => accumulator + a,
        0
      );
      const percentItemSizes = pixelItemSizes.map((pixelSize) =>
        toPercent(pixelSize, totalPixelItemSize)
      );
      const percentStringItemSizes = percentItemSizes.map(
        (percentSize, percentSizeIdx) => {
          if (
            percentSizeIdx === 0 ||
            percentSizeIdx + 1 === percentItemSizes.length
          ) {
            return `calc(${percentSize}% - ${gutterSize / 2}px`;
          }

          return `calc(${percentSize}% - ${gutterSize}px`;
        }
      );
      setPercentStringItemSizes(percentStringItemSizes);
    }, [gutterSize]);

    const getSplitItemSizes = (): number[] => {
      if (splitRef.current) {
        // auto fill split item size
        const splitItemElements =
          splitRef.current.querySelectorAll('.split__item');
        const splitItemRects = Array.from(splitItemElements).map(
          (splitItemElement) => {
            return splitItemElement.getBoundingClientRect();
          }
        );
        const pixelItemSizes = splitItemRects.map((rect) => rect[styleKey]);
        return pixelItemSizes
      }
      return []
    }

    // set mount size
    useEffect(() => {
      if (splitRef.current) {
        // auto fill split item size
        const splitItemElements =
          splitRef.current.querySelectorAll('.split__item');
        splitItemElements.forEach((splitItemElement) => {
          if (splitItemElement instanceof HTMLElement) {
            splitItemElement.style.flex = '1';
          }
        });
        const splitItemRects = Array.from(splitItemElements).map(
          (splitItemElement) => {
            return splitItemElement.getBoundingClientRect();
          }
        );
        const splitItemSizes = splitItemRects.map((rect) => rect[styleKey]);
        splitItemElements.forEach((splitItemElement) => {
          if (splitItemElement instanceof HTMLElement) {
            splitItemElement.style.flex = '';
          }
        });
        updateItemSizes(splitItemSizes);
      }
    }, [updateItemSizes]);

    return (
      <div
        {...props}
        ref={splitRef}
        className={`${splitClassName}${
          props.className ? ` ${props.className}` : ''
          }`}
      >
        {children.map((eachChild, childIdx) => {
          const checkedSize = checkSizeRange(
            minItemSizes[childIdx],
            itemSizes[childIdx]
          );
          const renderSize = flexContainer
            ? percentStringItemSizes[childIdx]
            : `${checkedSize}px`;
          const splitItemStyle = {
            [styleKey]: renderSize,
          };

          if (flexContainer && childIdx + 1 === children.length) {
            return (
              <div
                key={childIdx}
                className="split__item"
                style={splitItemStyle}
              >
                {eachChild}
              </div>
            );
          }

          return (
            <Fragment key={childIdx}>
              <div className="split__item" style={splitItemStyle}>
                {eachChild}
              </div>
              <Gutter
                index={childIdx}
                size={gutterSize}
                style={gutterStyle}
                direction={direction}
                flexContainer={flexContainer}
                minItemSizes={minItemSizes}
                itemSizes={itemSizes}
                onGutterDown={(event) => {
                  updateItemSizes(getSplitItemSizes());
                  onGutterDown?.(itemSizes, event);
                }}
                onGutterMove={(newSiblingPixelItemSizes, event) => {
                  const newPixelItemSizes = itemSizes.map(
                    (itemSize, itemSizeIdx) => {
                      if (childIdx === itemSizeIdx) {
                        return newSiblingPixelItemSizes[0];
                      }
                      if (childIdx + 1 === itemSizeIdx) {
                        return newSiblingPixelItemSizes[1] ?? itemSize;
                      }
                      return itemSize;
                    }
                  );
                  updateItemSizes(newPixelItemSizes);
                  onGutterMove?.(newPixelItemSizes, event);
                }}
                onGutterUp={(event) => {
                  onGutterUp?.(itemSizes, event);
                }}
              />
            </Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div
      {...props}
      className={`${splitClassName}${
        props.className ? ` ${props.className}` : ''
        }`}
    >
      {children}
    </div>
  );
};

export default Split;
