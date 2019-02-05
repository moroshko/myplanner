import React, { memo, useMemo, useCallback, useContext } from 'react';
import classNames from 'classnames';
import { format, isSameDay, isWeekend, getMonth } from 'date-fns';
import { ListHeader } from '../shared/list-components';
import Badge from '../shared/Badge';
import { AppContext } from '../reducer';
import { NEW_CALENDAR_TODO_DIALOG } from '../constants';
import './CalendarDayHeader.css';

function CalendarDayHeaderContainer({ date }) {
  const { state, dispatchChange } = useContext(AppContext);
  const { today } = state;
  const weekend = isWeekend(date);
  const onAddTodoClick = useCallback(() => {
    dispatchChange({
      type: 'SHOW_DIALOG',
      dialogName: NEW_CALENDAR_TODO_DIALOG,
      dialogData: {
        date,
      },
    });
  }, [date]);
  const dateBadge = useMemo(() => {
    if (isSameDay(date, today)) {
      return 'Today';
    }

    if (date.getDate() === 1) {
      return format(date, getMonth(date) === 0 ? 'MMMM yyyy' : 'MMMM');
    }

    return null;
  }, [date, today]);

  return (
    <CalendarDayHeader
      date={date}
      dateBadge={dateBadge}
      weekend={weekend}
      onAddTodoClick={onAddTodoClick}
    />
  );
}

const CalendarDayHeader = memo(
  ({ date, dateBadge, weekend, onAddTodoClick }) => {
    return (
      <ListHeader highlighted={weekend} onAddClick={onAddTodoClick}>
        <span className="CalendarDayHeaderDateContainer">
          <span className="CalendarDayHeaderDate">{format(date, 'd')}</span>
          <span
            className={classNames('CalendarDayHeaderDay', {
              CalendarDayHeaderDayWeekend: weekend,
            })}
          >
            {format(date, 'E')}
          </span>
        </span>
        {dateBadge && (
          <Badge color={weekend ? 'blue' : 'grey'} text={dateBadge} />
        )}
      </ListHeader>
    );
  }
);

export default CalendarDayHeaderContainer;
