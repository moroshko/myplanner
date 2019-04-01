import React, { useCallback, useContext } from 'react';
import { Header, HeaderMenu } from '../shared/header-components';
import { AddIcon } from '../icons';
import { AppContext } from '../reducer';
import { NEW_TODO_DIALOG } from '../constants';

function TodosHeader() {
  const { dispatchChange } = useContext(AppContext);
  const addTodo = useCallback(() => {
    dispatchChange({
      type: 'SHOW_DIALOG',
      dialogName: NEW_TODO_DIALOG,
    });
  }, []);

  return (
    <Header title="Todos!!">
      <button onClick={addTodo}>
        <AddIcon backgroundType="dark" />
      </button>
      <HeaderMenu />
    </Header>
  );
}

export default TodosHeader;
