import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { List } from './list-components';

function DraggableList({ droppableId, onDragEnd, children }) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={droppableId}>
        {({ droppableProps, innerRef, placeholder }) => (
          <List droppableProps={droppableProps} containerRef={innerRef}>
            {children}
            {placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default DraggableList;
