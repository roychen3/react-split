import { useState, useEffect, useRef, Fragment } from 'react';
import { isEqual } from 'lodash';
import Gutter from './Gutter';
import { FixedSplitProps } from './types';
import {
  formatItemSizes,
  checkSizeRange,
  getStyleKey,
  isNumber,
  fillItemSizes,
} from './utils';
import '../styles.css';
import './styles.css';

const FixedSplit = ({
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
}: FixedSplitProps) => {
  const getSplitClassName = (): string => {
    let className = 'split split--fixed';
    if (direction === 'horizontal') {
      className += ' split--horizontal';
    }

    if (direction === 'vertical') {
      className += ' split--vertical';
    }

    return className;
  };
  const splitClassName = getSplitClassName();

  if (children instanceof Array) {
    const splitRef = useRef<HTMLDivElement>(null);
    const splitItemsRef = useRef<Map<string, HTMLDivElement>>();
    const getSplitItemsMap = (): Map<string, HTMLDivElement> => {
      if (!splitItemsRef.current) {
        splitItemsRef.current = new Map();
        return splitItemsRef.current;
      }
      return splitItemsRef.current;
    };
    const minItemSizes = formatItemSizes(outsideMinItemSizes, children.length);
    const formattedOutsideItemSizes = formatItemSizes(
      outsideItemSizes ?? [],
      children.length
    );
    const [innerItemSizes, setInnerItemSizes] = useState<number[]>([]);
    const itemSizes = fillItemSizes(
      outsideItemSizes ? formattedOutsideItemSizes : innerItemSizes,
      children.length
    );
    const styleKey = getStyleKey(direction);

    const updateItemSizes = (newValue: number[]) => {
      if (!isEqual(itemSizes, newValue)) {
        setInnerItemSizes(newValue);
        onChange?.(newValue);
      }
    };

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
          const renderSize = isNumber(checkedSize) ? `${checkedSize}px` : null;
          const splitItemStyle = {
            [styleKey]: renderSize,
          };

          return (
            <Fragment key={childIdx}>
              <div
                data-testid="split__item"
                className="split__item"
                style={splitItemStyle}
                ref={(element) => {
                  const splitItemsMap = getSplitItemsMap();
                  if (element instanceof HTMLElement) {
                    splitItemsMap.set(`${childIdx}`, element);
                  } else {
                    splitItemsMap.delete(`${childIdx}`);
                  }
                }}
              >
                {eachChild}
              </div>
              <Gutter
                index={childIdx}
                size={gutterSize}
                style={gutterStyle}
                direction={direction}
                minItemSizes={minItemSizes}
                onGutterDown={() => {
                  const splitItemsMap = getSplitItemsMap();
                  const newItemSizes = Array.from(splitItemsMap).map((item) => {
                    const element = item[1];
                    return element.getBoundingClientRect()[styleKey];
                  });
                  updateItemSizes(newItemSizes);
                  onGutterDown?.(newItemSizes);
                }}
                onGutterMove={(newSiblingSizes) => {
                  const newItemSizes = itemSizes.map(
                    (itemSize, itemSizeIdx) => {
                      if (childIdx === itemSizeIdx) {
                        return newSiblingSizes[0];
                      }
                      if (childIdx + 1 === itemSizeIdx) {
                        return newSiblingSizes[1] ?? itemSize;
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

export default FixedSplit;
