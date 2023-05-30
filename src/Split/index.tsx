import { useState, useEffect, useRef, Fragment } from 'react';
import Gutter from './Gutter';
import { SplitProps } from './types';
import { formatItemSizes, checkSizeRange, getStyleKey, isNumber } from './utils'
import './styles.css';

const Split = ({
  children,
  direction = 'horizontal',
  flexContainer = true,
  minItemSizes: outsideMinItemSizes = [],
  itemSizes: outsideItemSizes = [],
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
    const splitRef = useRef<HTMLDivElement>(null);
    const minItemSizes = formatItemSizes(outsideMinItemSizes, children.length);
    const formattedOutsideItemSizes = formatItemSizes(outsideItemSizes, children.length);
    const [innerItemSizes, setInnerItemSizes] = useState<number[]>(formattedOutsideItemSizes);
    const itemSizes = formattedOutsideItemSizes.length >= innerItemSizes.length ? formattedOutsideItemSizes : innerItemSizes
    const styleKey = getStyleKey(direction);

    // set mount size
    useEffect(() => {
      if (splitRef.current) {
        const splitItemElements = splitRef.current.querySelectorAll('.split__item')
        const splitItemRects = Array.from(splitItemElements).map((splitItemElement) => {
          return splitItemElement.getBoundingClientRect()
        })
        const defaultItemSizes = splitItemRects.map((rect) => rect[styleKey])
        setInnerItemSizes(defaultItemSizes)
      }
    }, [])

    return (
      <div {...props} ref={splitRef} className={`${splitClassName}${props.className ? ` ${props.className}` : ''}`}>
        {children.map((eachChild, childIdx) => {
          const renderSize = checkSizeRange(minItemSizes[childIdx], itemSizes[childIdx]);
          const splitItemStyle = {
            [styleKey]: isNumber(renderSize) ? `${renderSize}px` : undefined,
            flex: isNumber(renderSize) ? undefined : '1'
          }

          if (flexContainer && childIdx + 1 === children.length) {
            return <div key={childIdx} className='split__item' style={splitItemStyle}>{eachChild}</div>;
          }

          return (
            <Fragment key={childIdx}>
              <div className='split__item' style={splitItemStyle}>
                {eachChild}
              </div>
              <Gutter
                index={childIdx}
                style={gutterStyle}
                direction={direction}
                flexContainer={flexContainer}
                minItemSizes={minItemSizes}
                itemSizes={itemSizes}
                onGutterDown={(event) => {
                  onGutterDown?.(itemSizes, event)
                }}
                onGutterMove={(newSiblingItemSizes, event) => {
                  const newItemSizes = itemSizes.map((itemSize, itemSizeIdx) => {
                    if (childIdx === itemSizeIdx) {
                      return newSiblingItemSizes[0]
                    }
                    if (childIdx + 1 === itemSizeIdx) {
                      return newSiblingItemSizes[1] ?? itemSize
                    }
                    return itemSize
                  })
                  setInnerItemSizes(newItemSizes);
                  onGutterMove?.(newItemSizes, event)
                }}
                onGutterUp={(event) => {
                  onGutterUp?.(itemSizes, event)
                }}
              />
            </Fragment>
          );
        })}
      </div>
    )
  }

  return (
    <div {...props} className={`${splitClassName}${props.className ? ` ${props.className}` : ''}`}>
      {children}
    </div>
  );
};

export default Split;
