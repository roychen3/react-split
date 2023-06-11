import { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import Gutter from './Gutter';
import { FlexSplitProps } from './types';
import {
  formatItemSizes,
  getStyleKey,
  formatRenderItemSizes,
} from './utils';
import '../styles.css';
import './styles.css';

const FlexSplit = ({
  children,
  direction = 'horizontal',
  minItemSizes: outsideMinItemSizes = [],
  itemSizes: outsideItemSizes,
  gutterSize = 10,
  gutterStyle,
  onChange,
  onGutterDown,
  onGutterMove,
  onGutterUp,
  ...props
}: FlexSplitProps) => {
  const getSplitClassName = (): string => {
    let className = 'split split--flex';
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
    const formattedOutsideItemSizes = formatItemSizes(
      outsideItemSizes ?? [],
      children.length
    );
    const styleKey = getStyleKey(direction);
    const splitRef = useRef<HTMLDivElement>(null);
    const splitItemsRef = useRef<Map<string, HTMLDivElement>>();
    const getSplitItemsMap = () => {
      if (!splitItemsRef.current) {
        splitItemsRef.current = new Map();
      }
      return splitItemsRef.current;
    };
    const [innerItemSizes, setInnerItemSizes] = useState<number[]>(
      formattedOutsideItemSizes
    );
    const itemSizes = outsideItemSizes
      ? formattedOutsideItemSizes
      : innerItemSizes;

    // renderSize = totalSize * percent - gutterSize
    // renderSize + gutterSize = totalSize * percent
    // (renderSize + gutterSize)/ totalSize =  percent
    const calculateCssSize = (
      renderItemSizes: number[],
      gutterSize: number
    ) => {
      const totalRenderItemSize =
        splitRef.current?.getBoundingClientRect()[styleKey];

      const result = renderItemSizes.map((renderSize, idx) => {
        if (!totalRenderItemSize) return (1 / renderItemSizes.length) * 100;
        const calculateGutterSize =
          idx === 0 || idx + 1 === renderItemSizes.length
            ? gutterSize / 2
            : gutterSize;

        const percent =
          ((renderSize + calculateGutterSize) / totalRenderItemSize) * 100;
        return percent;
      });

      return result;
    };
    const percentItemSizes = calculateCssSize(itemSizes, gutterSize);
    const percentStringItemSizes = formatRenderItemSizes(
      percentItemSizes,
      gutterSize
    );

    // set mount size
    useEffect(() => {
      if (splitRef.current) {
        // auto fill split item size
        const splitItemsMap = getSplitItemsMap();
        const splitItemElements = Array.from(splitItemsMap).map(
          (item) => item[1]
        );
        splitItemElements.forEach((splitItemElement) => {
          if (splitItemElement instanceof HTMLElement) {
            splitItemElement.style.flex = '1';
          }
        });
        const splitItemRects = splitItemElements.map((splitItemElement) => {
          return splitItemElement.getBoundingClientRect();
        });
        const initialSplitItemSizes = splitItemRects.map(
          (rect) => rect[styleKey]
        );
        splitItemElements.forEach((splitItemElement) => {
          if (splitItemElement instanceof HTMLElement) {
            splitItemElement.style.flex = '';
          }
        });
        setInnerItemSizes(initialSplitItemSizes);
        onChange?.(initialSplitItemSizes);
      }
    }, []);

    return (
      <div
        {...props}
        ref={splitRef}
        className={`${splitClassName}${
          props.className ? ` ${props.className}` : ''
        }`}
      >
        {children.map((eachChild, childIdx) => {
          const renderSize = percentStringItemSizes[childIdx];
          const splitItemStyle = {
            [styleKey]: renderSize,
          };

          if (childIdx + 1 === children.length) {
            return (
              <div
                ref={(node) => {
                  const splitItemsMap = getSplitItemsMap();
                  if (node instanceof HTMLElement) {
                    splitItemsMap.set(`${childIdx}`, node);
                  } else {
                    splitItemsMap.delete(`${childIdx}`);
                  }
                }}
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
              <div
                ref={(node) => {
                  const splitItemsMap = getSplitItemsMap();
                  if (node instanceof HTMLElement) {
                    splitItemsMap.set(`${childIdx}`, node);
                  } else {
                    splitItemsMap.delete(`${childIdx}`);
                  }
                }}
                className="split__item"
                style={splitItemStyle}
              >
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
                getSplitItemsMap={getSplitItemsMap}
                onGutterDown={(newItemSizes) => {
                  setInnerItemSizes(newItemSizes);
                  onChange?.(newItemSizes);
                  onGutterDown?.(newItemSizes);
                }}
                onGutterMove={(newSiblingItemSizes) => {
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
                  setInnerItemSizes(newItemSizes);
                  onChange?.(newItemSizes);
                  onGutterMove?.(newItemSizes);
                }}
                onGutterUp={() => {
                  onGutterUp?.(itemSizes);
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

export default FlexSplit;
