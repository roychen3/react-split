import { useState, useEffect, useRef, Fragment } from 'react';
import Gutter from './Gutter';
import { SplitProps } from './types';
import { formatItemSizes, checkSizeRange, getStyleKey, isNumber, pixelToPercent } from './utils'
import './styles.css';

const Split = ({
  children,
  direction = 'horizontal',
  flexContainer = true,
  minItemSizes: outsideMinItemSizes = [],
  itemSizes: outsideItemSizes,
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
    const formattedOutsideItemSizes = outsideItemSizes ? formatItemSizes(outsideItemSizes, children.length) : [];
    const [innerItemSizes, setInnerItemSizes] = useState<number[]>(formattedOutsideItemSizes);
    const [itemSizesPercent, setInnerItemSizesPercent] = useState<number[]>([]);
    const itemSizes = outsideItemSizes ? formattedOutsideItemSizes : innerItemSizes
    const styleKey = getStyleKey(direction);
    const splitRef = useRef<HTMLDivElement>(null);
    const [splitSizePx, setSplitSizePx] = useState(0)

    // set mount size
    useEffect(() => {
      if (splitRef.current) {
        if (!outsideItemSizes) {
          const splitItemElements = splitRef.current.querySelectorAll('.split__item')
          splitItemElements.forEach((splitItemElement) => {
            if (splitItemElement instanceof HTMLElement) {
              splitItemElement.style.flex = '1'
            }
          })
          const splitItemRects = Array.from(splitItemElements).map((splitItemElement) => {
            return splitItemElement.getBoundingClientRect()
          })
          splitItemElements.forEach((splitItemElement) => {
            if (splitItemElement instanceof HTMLElement) {
              splitItemElement.style.flex = ''
            }
          })
          const defaultItemSizes = splitItemRects.map((rect) => rect[styleKey])
          setInnerItemSizes(defaultItemSizes)
        }

        const splitElementSize = splitRef.current.getBoundingClientRect()[styleKey]
        setSplitSizePx(splitElementSize)
      }
    }, [outsideItemSizes])

    useEffect(() => {
      const onResize = () => {
        if (splitRef.current) {
          const splitElementSizePx = splitRef.current.getBoundingClientRect()[styleKey];
          setSplitSizePx(splitElementSizePx);
        }
      }
      window.addEventListener('resize', onResize)
      return () => {
        window.removeEventListener('resize', onResize)
      }
    }, [])

    useEffect(() => {
      if (splitSizePx) {
        const percentSizes = itemSizes.map((itemSize) => pixelToPercent(itemSize, splitSizePx))
        console.log('percentSizes', percentSizes)
        setInnerItemSizesPercent(percentSizes)
      }
    }, [itemSizes])

    return (
      <div {...props} ref={splitRef} className={`${splitClassName}${props.className ? ` ${props.className}` : ''}`}>
        {children.map((eachChild, childIdx) => {
          const checkedSize = checkSizeRange(minItemSizes[childIdx], itemSizes[childIdx]);
          const renderSize = flexContainer ? `${itemSizesPercent[childIdx]}%` : `${checkedSize}px`;
          const splitItemStyle = {
            // [styleKey]: checkedSize,
            [styleKey]: renderSize,
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
