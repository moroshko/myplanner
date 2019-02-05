import React from 'react';
import classNames from 'classnames';
import './ListItem.css';

function ListItem({
  vertical,
  checked,
  isDragging,
  draggableProps,
  containerRef,
  children,
}) {
  return (
    <li
      className={classNames('ListItem', {
        ListItemVertical: vertical,
        ListItemChecked: checked,
        ListItemDragging: isDragging,
      })}
      {...draggableProps}
      ref={containerRef}
    >
      {children}
    </li>
  );
}

export default ListItem;
