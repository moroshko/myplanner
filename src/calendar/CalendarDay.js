import React, { useContext } from 'react';
import CalendarDayHeader from './CalendarDayHeader';
import { List, ListItem, ListItemButton } from '../shared/list-components';
import { AppContext } from '../reducer';
import { STATUS_LOADED, EDIT_CALENDAR_TODO_DIALOG } from '../constants';
import './CalendarDay.css';

export default function CalendarDay({ date, status, todos, style }) {
  const { dispatchChange } = useContext(AppContext);

  return (
    <div style={style}>
      <CalendarDayHeader date={date} />
      {status === STATUS_LOADED ? (
        <List>
          {todos.map(todo => {
            const { id, timeStr, description } = todo;

            return (
              <ListItem key={id}>
                <ListItemButton
                  onClick={() => {
                    dispatchChange({
                      type: 'SHOW_DIALOG',
                      dialogName: EDIT_CALENDAR_TODO_DIALOG,
                      dialogData: {
                        date,
                        todo,
                      },
                    });
                  }}
                >
                  <span className="CalendarDayTodoTime">{timeStr}</span>
                  <span
                    className="CalendarDayTodoDescription"
                    style={{
                      WebkitBoxOrient:
                        'vertical' /* For some reason, setting it in CSS is ignored :( Without this, ellipsis doesn't work. */,
                    }}
                  >
                    {description}
                  </span>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <div className="CalendarDayLoading">Loading...</div>
      )}
    </div>
  );
}
