import React, { memo, useCallback, useContext } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {
  ListItem,
  ListItemButton,
  ListItemDragHandle,
} from '../shared/list-components';
import { AppContext } from '../reducer';
import { EDIT_TODO_DIALOG } from '../constants';

function TodoContainer({ todo, isDraggable }) {
  const { id, description, ownerUid, index } = todo;
  const { state, dispatchChange } = useContext(AppContext);
  const { todoOwners } = state;
  const owner = todoOwners.find(todoOwner => todoOwner.uid === ownerUid);
  const onEditButtonClick = useCallback(() => {
    dispatchChange({
      type: 'SHOW_DIALOG',
      dialogName: EDIT_TODO_DIALOG,
      dialogData: {
        todo,
      },
    });
  }, [todo]);

  return (
    <Todo
      id={id}
      index={index}
      owner={owner}
      description={description}
      onEditButtonClick={onEditButtonClick}
      isDraggable={isDraggable}
    />
  );
}

const Todo = memo(
  ({ id, index, owner, description, onEditButtonClick, isDraggable }) => (
    <Draggable draggableId={id} index={index}>
      {({ draggableProps, dragHandleProps, innerRef }, { isDragging }) => (
        <ListItem
          isDragging={isDragging}
          draggableProps={draggableProps}
          containerRef={innerRef}
        >
          <ListItemButton userPhoto={owner} onClick={onEditButtonClick}>
            {description}
          </ListItemButton>
          <ListItemDragHandle
            isDraggable={isDraggable}
            dragHandleProps={dragHandleProps}
          />
        </ListItem>
      )}
    </Draggable>
  )
);

export default TodoContainer;
