import { useState, useRef, Fragment } from 'react';
import Gutter from './Gutter';
import { FixedSplitProps } from './types';
import {
  formatItemSizes,
  checkSizeRange,
  getStyleKey,
  isNumber,
  fillItemSizes,
} from './utils';
import './styles.css';

const FixedSplit = ({
  children,
  direction = 'horizontal',
  minItemSizes: outsideMinItemSizes = [],
  itemSizes: outsideItemSizes,
  gutterSize = 10,
  gutterStyle,
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
                  onGutterDown?.({ itemSizes, moveDistance: 0 });
                }}
                onGutterMove={({ newSiblingSizes, moveDistance }) => {
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
                  onGutterMove?.({
                    itemSizes: newItemSizes,
                    moveDistance,
                  });
                }}
                onGutterUp={({ moveDistance }) => {
                  onGutterUp?.({ itemSizes, moveDistance });
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
