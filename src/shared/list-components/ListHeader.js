import React from 'react';
import classNames from 'classnames';
import { AddIcon } from '../../icons';
import './ListHeader.css';

function ListHeader({ highlighted, onAddClick, children }) {
  return (
    <div
      className={classNames('ListHeader', {
        ListHeaderHighlighted: highlighted,
      })}
    >
      {children}
      {onAddClick && (
        <button className="ListHeaderAddButton" onClick={onAddClick}>
          <AddIcon backgroundType={highlighted ? 'blue' : 'light'} />
        </button>
      )}
    </div>
  );
}

export default ListHeader;
