import { Fragment } from 'react';
import Gutter from './Gutter';
import { SplitProps } from './types';

import './styles.css';

const Split = ({
  children,
  direction = 'horizontal',
  flexContainer = true,
}: SplitProps) => {
  const renderChildren = () => {
    if (children instanceof Array) {
      return children.map((eachChild, idx) => {
        if (flexContainer && idx + 1 === children.length) {
          return <Fragment key={idx}>{eachChild}</Fragment>;
        }
        return (
          <Fragment key={idx}>
            {eachChild}
            <Gutter direction={direction} flexContainer={flexContainer} />
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
  return <div className={splitClassName}>{splitChildren}</div>;
};

export default Split;
