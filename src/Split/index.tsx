import { Fragment } from 'react';
import Gutter from './Gutter';
import { getStyleKey } from './utils'
import { SplitProps } from './types';

import './styles.css';

const Split = ({
  children,
  direction = 'horizontal',
  flexContainer = true,
  itemSizes = [],
  onGutterDown,
  onGutterMove,
  onGutterUp,
  ...props
}: SplitProps) => {
  const renderChildren = () => {
    if (children instanceof Array) {
      return children.map((eachChild, idx) => {
        const styleKey = getStyleKey(direction);
        const size = itemSizes instanceof Array ? itemSizes[idx] : itemSizes;
        if (flexContainer && idx + 1 === children.length) {
          return <div key={idx} className='split__item' style={{ [styleKey]: size }}>{eachChild}</div>;
        }
        return (
          <Fragment key={idx}>
            <div className='split__item' style={{ [styleKey]: size }}>
              {eachChild}
            </div>
            <Gutter
              index={idx}
              direction={direction}
              flexContainer={flexContainer}
              itemSizes={itemSizes}
              onGutterDown={onGutterDown}
              onGutterMove={onGutterMove}
              onGutterUp={onGutterUp}
            />
          </Fragment>
        );
      });
    }
    return children;
  };
  const splitChildren = renderChildren();

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
  return (
    <div className={splitClassName} {...props}>
      {splitChildren}
    </div>
  );
};

export default Split;
