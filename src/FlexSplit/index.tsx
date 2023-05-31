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
        (accumulator, a) => accumulator + a,
        0
      );
      const percentItemSizes = pixelItemSizes.map((pixelSize) =>
        toPercent(pixelSize, totalPixelItemSize)
      );
      return percentItemSizes;
    };

    const updateItemSizes = useCallback(
      (pixelItemSizes: number[]) => {
        if (!splitRef.current) return;

        const roundPixelItemSizes = pixelItemSizes.map((size) =>
          Math.round(size)
        );
        setInnerItemSizes(roundPixelItemSizes);
        const percentItemSizes = calculatePercentItemSizes(roundPixelItemSizes);
        setPercentItemSizes(percentItemSizes);
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
      },
      [gutterSize]
    );

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
        return pixelItemSizes;
      }
      return [];
    };

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
                onGutterDown={(event) => {
                  if (splitRef.current) {
                    const totalSplitSize =
                      splitRef.current.getBoundingClientRect()[styleKey];

                    // renderSize = totalSplitSize * percent_item_size - gutterSize

                    const newItemSizes2 = getSplitItemSizes().map(
                      (renderSize, itemSizeIdx) => {
                        console.log(renderSize);
                        if (
                          itemSizeIdx === 0 ||
                          itemSizeIdx + 1 === children.length
                        ) {
                          return (
                            ((renderSize + gutterSize / 2) / totalSplitSize) * 100
                          );
                        }
                        return ((renderSize + gutterSize) / totalSplitSize) * 100;
                      }
                    );
                    console.log('newItemSizes2', newItemSizes2.map((size) => Math.round(size)))
                    console.log('percentItemSizes', percentItemSizes.map((size) => Math.round(size)))

                    const newItemSizes = percentItemSizes.map((percentSize) => {
                      const result =
                        ((totalSplitSize - (children.length - 1) * gutterSize) *
                          percentSize) /
                        100;
                      return Math.round(result);
                    });
                    console.log('newItemSizes', newItemSizes)
                    console.log('itemSizes', itemSizes)

                    updateItemSizes(newItemSizes);
                  }
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
                  updateItemSizes(
                    newPixelItemSizes.map((size) => Math.round(size))
                  );
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
