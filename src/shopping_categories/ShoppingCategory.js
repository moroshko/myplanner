import React, { memo, useCallback, useContext } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {
  ListItem,
  ListItemButton,
  ListItemDragHandle,
} from '../shared/list-components';
import { AppContext } from '../reducer';
import { EDIT_SHOPPING_CATEGORY_DIALOG } from '../constants';

function ShoppingCategoryContainer({ shoppingCategory, isDraggable }) {
  const { id, name, index } = shoppingCategory;
  const { dispatchChange } = useContext(AppContext);
  const onEditButtonClick = useCallback(() => {
    dispatchChange({
      type: 'SHOW_DIALOG',
      dialogName: EDIT_SHOPPING_CATEGORY_DIALOG,
      dialogData: {
        shoppingCategory,
      },
    });
  }, [shoppingCategory]);

  return (
    <ShoppingCategory
      id={id}
      index={index}
      name={name}
      onEditButtonClick={onEditButtonClick}
      isDraggable={isDraggable}
    />
  );
}

const ShoppingCategory = memo(
  ({ id, index, name, onEditButtonClick, isDraggable }) => (
    <Draggable draggableId={id} index={index}>
      {({ draggableProps, dragHandleProps, innerRef }, { isDragging }) => (
        <ListItem
          isDragging={isDragging}
          draggableProps={draggableProps}
          containerRef={innerRef}
        >
          <ListItemButton onClick={onEditButtonClick}>{name}</ListItemButton>
          <ListItemDragHandle
            isDraggable={isDraggable}
            dragHandleProps={dragHandleProps}
          />
        </ListItem>
      )}
    </Draggable>
  )
);

export default ShoppingCategoryContainer;
