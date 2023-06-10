import { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import Gutter from './Gutter';
import { FlexSplitProps } from './types';
import {
  formatItemSizes,
  getStyleKey,
  calculatePercentItemSizes,
  formatRenderItemSizes,
} from './utils';
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
    const [innerItemSizes, setInnerItemSizes] = useState<number[]>(
      formattedOutsideItemSizes
    );
    const itemSizes = outsideItemSizes
      ? formattedOutsideItemSizes
      : innerItemSizes;
    const percentItemSizes = calculatePercentItemSizes(itemSizes);
    const percentStringItemSizes = formatRenderItemSizes(
      percentItemSizes,
      gutterSize
    );
    const styleKey = getStyleKey(direction);
    const splitRef = useRef<HTMLDivElement>(null);

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
                  setInnerItemSizes(newItemSizes);
                  onChange?.(newItemSizes);
                  onGutterDown?.(newItemSizes, event);
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
                  setInnerItemSizes(newItemSizes);
                  onChange?.(newItemSizes);
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

export default FlexSplit;
