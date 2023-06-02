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
    }

    if (direction === 'vertical') {
      className += ' split--vertical';
    }
    className += ' split--flex-container';

    return className;
  };
  const splitClassName = getSplitClassName();

  if (children instanceof Array) {
    const minItemSizes = formatItemSizes(outsideMinItemSizes, children.length);
    const [innerItemSizes, setInnerItemSizes] = useState<number[]>([]);
    const [percentItemSizes, setPercentItemSizes] = useState<number[]>([]);
    const [percentStringItemSizes, setPercentStringItemSizes] = useState<
      string[]
    >([]);
    const itemSizes = innerItemSizes;
    const styleKey = getStyleKey(direction);
    const splitRef = useRef<HTMLDivElement>(null);

    const calculatePercentItemSizes = (pixelItemSizes: number[]): number[] => {
      const totalPixelItemSize = pixelItemSizes.reduce(
        (accumulator, size) => accumulator + size,
        0
      );
      const result = pixelItemSizes.map((pixelSize) =>
        toPercent(pixelSize, totalPixelItemSize)
      );
      return result;
    };

    const updateItemSizes = useCallback(
      (pixelItemSizes: number[]) => {
        if (!splitRef.current) return;

        setInnerItemSizes(pixelItemSizes);
        const newPercentItemSizes = calculatePercentItemSizes(pixelItemSizes);
        setPercentItemSizes(newPercentItemSizes);
        const newPercentStringItemSizes = newPercentItemSizes.map(
          (percentSize, percentSizeIdx) => {
            if (
              percentSizeIdx === 0 ||
              percentSizeIdx + 1 === newPercentItemSizes.length
            ) {
              return `calc(${percentSize}% - ${gutterSize / 2}px`;
            }

            return `calc(${percentSize}% - ${gutterSize}px`;
          }
        );
        setPercentStringItemSizes(newPercentStringItemSizes);
      },
      [gutterSize]
    );

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
          const renderSize = percentStringItemSizes[childIdx];
          const splitItemStyle = {
            [styleKey]: renderSize,
          };

          if (childIdx + 1 === children.length) {
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
                minItemSizes={minItemSizes}
                itemSizes={itemSizes}
                percentItemSizes={percentItemSizes}
                onGutterDown={(newItemSizes, event) => {
                  updateItemSizes(newItemSizes);
                  onGutterDown?.(itemSizes, event);
                }}
                onGutterMove={(newSiblingItemSizes, event) => {
                  const newItemSizes = itemSizes.map(
                    (itemSize, itemSizeIdx) => {
                      if (childIdx === itemSizeIdx) {
                        return newSiblingItemSizes[0];
                      }
                      if (childIdx + 1 === itemSizeIdx) {
                        return newSiblingItemSizes[1] ?? itemSize;
                      }
                      return itemSize;
                    }
                  );
                  updateItemSizes(newItemSizes);
                  onGutterMove?.(newItemSizes, event);
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