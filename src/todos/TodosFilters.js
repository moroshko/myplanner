import React, { useMemo, useCallback, useContext } from 'react';
import Label from '../shared/Label';
import OwnerPicker from '../shared/OwnerPicker';
import { AppContext } from '../reducer';
import { setTodosOwnerFilterToLocalStorage } from '../localStorage';
import './TodosFilters.css';

function TodosFilters() {
  const { state, dispatchChange } = useContext(AppContext);
  const { todoOwners, todosOwnerFilter, todos } = state;
  const onOwnerFilterChange = useCallback(
    ownerUid => {
      dispatchChange({
        type: 'UPDATE_TODOS_OWNER_FILTER',
        todosOwnerFilter: ownerUid,
      });

      setTodosOwnerFilterToLocalStorage(ownerUid);
    },
    [todosOwnerFilter]
  );
  const todosCounts = useMemo(() => {
    if (todoOwners === null || todos === null) {
      return null;
    }

    const counts = todoOwners.reduce((acc, todoOwner) => {
      acc[todoOwner.uid] = 0;

      return acc;
    }, {});

    todos.forEach(todo => {
      counts[todo.ownerUid] += 1;
    });

    return counts;
  }, [todoOwners, todos]);

  return (
    <div className="TodosFilters">
      <div className="TodosFiltersInnerContainer">
        <Label text="Filter by owner:" />
        <div className="TodosFiltersOwnerPickerContainer">
          <OwnerPicker
            value={todosOwnerFilter}
            onChange={onOwnerFilterChange}
          />
          <div className="TodosFiltersTodoCountersContainer">
            {todoOwners.map(todoOwner => (
              <div className="TodosFiltersTodoCounter" key={todoOwner.uid}>
                {todosCounts[todoOwner.uid]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodosFilters;
