import React from 'react';
import classNames from 'classnames';
import DragHandleIcon from '../../icons/DragHandleIcon';
import './ListItemDragHandle.css';

function ListItemDragHandle({ isDraggable, dragHandleProps }) {
  return (
    <span
      className={classNames('ListItemDragHandle', {
        ListItemDragHandleHidden: !isDraggable,
      })}
      {...dragHandleProps}
    >
      <DragHandleIcon />
    </span>
  );
}

export default ListItemDragHandle;
