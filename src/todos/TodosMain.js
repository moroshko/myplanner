import React, { useEffect, useMemo, useCallback, useContext } from 'react';
import TodosFilters from './TodosFilters';
import TodosList from './TodosList';
import { AppContext } from '../reducer';
import { getUserGroup } from '../usersAPI';
import { getTodos, subscribeToTodosUpdates } from './todosAPI';
import { ERROR_DIALOG } from '../constants';
import './TodosMain.css';

function TodosMain() {
  const { state, dispatchChange } = useContext(AppContext);
  const { user, todosOwnerFilter, todos } = state;
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
    if (user === null) {
      return;
    }

    getUserGroup(user.uid).then(userGroup => {
      const owners = userGroup.users.map(owner => ({
        uid: owner.uid,
        name: owner.name,
        photoUrl: owner.photoUrl,
      }));
      const userIndex = owners.findIndex(owner => owner.uid === user.uid);
      const [currentUser] = owners.splice(userIndex, 1);
      const ownersWithCurrentUserFirst = [currentUser, ...owners];
      const todoOwners = [
        {
          uid: null,
          name: null,
          photoUrl: null,
        },
        ...ownersWithCurrentUserFirst,
      ];

      dispatchChange({
        type: 'UPDATE_TODO_OWNERS',
        todoOwners,
      });
    });
  }, [user]);

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
