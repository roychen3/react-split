import { Fragment } from 'react';
import Gutter from './Gutter';
import { getStyleKey } from './utils'
import { SplitProps } from './types';

import './styles.css';

const Split = ({
  children,
  direction = 'horizontal',
  flexContainer = true,
  minItemSizes,
  itemSizes,
  gutterStyle,
  onGutterDown,
  onGutterMove,
  onGutterUp,
  ...props
}: SplitProps) => {
  const renderChildren = () => {
    if (children instanceof Array) {
      return children.map((eachChild, idx) => {
        if (flexContainer && idx + 1 === children.length) {
          return <div key={idx} className='split__item'>{eachChild}</div>;
        }
        return (
          <Fragment key={idx}>
            <div className='split__item'>
              {eachChild}
            </div>
            <Gutter
              index={idx}
              style={gutterStyle}
              direction={direction}
              flexContainer={flexContainer}
              minItemSizes={minItemSizes}
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
    <div {...props} className={`${splitClassName}${props.className ? ` ${props.className}` : ''}`}>
      {splitChildren}
    </div>
  );
};

export default Split;
