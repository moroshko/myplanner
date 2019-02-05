import React, { useCallback, useContext } from 'react';
import EmptyMessage from '../shared/EmptyMessage';
import DraggableList from '../shared/DraggableList';
import Todo from './Todo';
import { updateTodosIndices } from './todosAPI';
import { AppContext } from '../reducer';
import { NEW_TODO_DIALOG, ERROR_DIALOG } from '../constants';
import './TodosList.css';

function TodosList({ filteredTodos }) {
  const { state, dispatchChange } = useContext(AppContext);
  const { todosOwnerFilter } = state;
  const onAddTodoClick = useCallback(() => {
    dispatchChange({
      type: 'SHOW_DIALOG',
      dialogName: NEW_TODO_DIALOG,
    });
  }, []);
  const onDragEnd = useCallback(
    ({ source, destination }) => {
      if (destination === null || destination.index === source.index) {
        return;
      }

      const updates = [];

      if (source.index < destination.index) {
        for (
          let index = source.index + 1;
          index <= destination.index;
          index++
        ) {
          updates.push({
            id: filteredTodos[index].id,
            index: filteredTodos[index].index - 1,
          });
        }

        updates.push({
          id: filteredTodos[source.index].id,
          index: destination.index,
        });
      } else {
        for (let index = destination.index; index < source.index; index++) {
          updates.push({
            id: filteredTodos[index].id,
            index: filteredTodos[index].index + 1,
          });
        }

        updates.push({
          id: filteredTodos[source.index].id,
          index: destination.index,
        });
      }

      dispatchChange({
        type: 'OPTIMISTICALLY_UPDATE_TODOS_INDICES',
        sourceIndex: source.index,
        destinationIndex: destination.index,
      });

      updateTodosIndices(updates).catch(error => {
        dispatchChange({
          type: 'SHOW_DIALOG',
          dialogName: ERROR_DIALOG,
          dialogData: {
            errorMessage: error.message,
            onClose: () => {
              // This will revert the optimistic update above.
              dispatchChange({
                type: 'OPTIMISTICALLY_UPDATE_TODOS_INDICES',
                sourceIndex: destination.index,
                destinationIndex: source.index,
              });
            },
          },
        });
      });
    },
    [filteredTodos]
  );

  return filteredTodos.length === 0 ? (
    <EmptyMessage buttonText="Add Todo" onButtonClick={onAddTodoClick}>
      All Done!
    </EmptyMessage>
  ) : (
    <DraggableList
      droppableId={`todos-owner-${todosOwnerFilter}`}
      onDragEnd={onDragEnd}
    >
      {filteredTodos.map(todo => (
        <Todo
          todo={todo}
          isDraggable={filteredTodos.length > 1}
          key={todo.id}
        />
      ))}
    </DraggableList>
  );
}

export default TodosList;
