import { format, addDays } from 'date-fns';
import { getDb } from '../firebase';
import {
  parseCalendarTodoText,
  timeStrTo24hours,
  timeStrTo12hours,
} from '../calendar/calendarUtils';
import { DATE_STR_FORMAT } from '../constants';

function getCalendarCollection() {
  return getDb().collection('calendar');
}

function createCalendarTodo({ date, text }) {
  const { timeStr, description } = parseCalendarTodoText(text);

  return getCalendarCollection().add({
    dateStr: format(date, DATE_STR_FORMAT),
    timeStr: timeStr === null ? null : timeStrTo24hours(timeStr),
    description,
  });
}

function updateCalendarTodo({ id, text }) {
  const { timeStr, description } = parseCalendarTodoText(text);

  return getCalendarCollection()
    .doc(id)
    .update({
      timeStr: timeStr === null ? null : timeStrTo24hours(timeStr),
      description,
    });
}

function deleteCalendarTodo({ id }) {
  return getCalendarCollection()
    .doc(id)
    .delete();
}

function getCalendarTodosFromSnapshot(snapshot) {
  return snapshot.docs.map(doc => {
    const { dateStr, timeStr, description } = doc.data();

    return {
      id: doc.id,
      dateStr,
      timeStr: timeStr === null ? null : timeStrTo12hours(timeStr),
      description,
    };
  });
}

function orderedCalendarTodos({ fromDateStr, toDateStr }) {
  return getCalendarCollection()
    .where('dateStr', '>=', fromDateStr)
    .where('dateStr', '<=', toDateStr)
    .orderBy('dateStr', 'asc')
    .orderBy('timeStr', 'asc');
}

function getCalendarTodos({ fromDate, days }) {
  const fromDateStr = format(fromDate, DATE_STR_FORMAT);
  const toDateStr = format(addDays(fromDate, days - 1), DATE_STR_FORMAT);

  return orderedCalendarTodos({ fromDateStr, toDateStr })
    .get()
    .then(getCalendarTodosFromSnapshot);
}

function subscribeToCalendarTodosUpdates({
  fromDate,
  toDate,
  startIndex,
  stopIndex,
  onUpdate,
  onError,
}) {
  const fromDateStr = format(fromDate, DATE_STR_FORMAT);
  const toDateStr = format(toDate, DATE_STR_FORMAT);

  return orderedCalendarTodos({ fromDateStr, toDateStr }).onSnapshot(
    snapshot => {
      onUpdate({
        startIndex,
        stopIndex,
        todos: getCalendarTodosFromSnapshot(snapshot),
      });
    },
    onError
  );
}

export {
  createCalendarTodo,
  updateCalendarTodo,
  deleteCalendarTodo,
  getCalendarTodos,
  subscribeToCalendarTodosUpdates,
};
