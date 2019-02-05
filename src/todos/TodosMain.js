import React, { useEffect, useMemo, useCallback, useContext } from 'react';
import TodosFilters from './TodosFilters';
import TodosList from './TodosList';
import { AppContext } from '../reducer';
import { getTodos, subscribeToTodosUpdates } from './todosAPI';
import { ERROR_DIALOG } from '../constants';
import './TodosMain.css';

function TodosMain() {
  const { state, dispatchChange } = useContext(AppContext);
  const { todosOwnerFilter, todos } = state;
  const filteredTodos = useMemo(
    () =>
      todos === null
        ? null
        : todos.filter(todo => todo.ownerUid === todosOwnerFilter),
    [todosOwnerFilter, todos]
  );
  const onUpdate = useCallback(({ todos }) => {
    dispatchChange({
      type: 'UPDATE_TODOS',
      todos,
    });
  }, []);
  const onUpdateError = useCallback(error => {
    // Just swallowing the error here since Dialogs are not visible
    // to logged out users.
  }, []);

  useEffect(() => {
    getTodos()
      .then(todos => {
        dispatchChange({
          type: 'ADD_TODOS',
          todos,
        });
      })
      .catch(error => {
        dispatchChange({
          type: 'SHOW_DIALOG',
          dialogName: ERROR_DIALOG,
          dialogData: {
            errorMessage: error.message,
          },
        });
      });
  }, []);

  useEffect(() => {
    return subscribeToTodosUpdates({
      onUpdate,
      onError: onUpdateError,
    });
  }, []);

  return filteredTodos === null ? null : (
    <div className="TodosMain">
      <TodosFilters />
      <TodosList filteredTodos={filteredTodos} />
    </div>
  );
}

export default TodosMain;
