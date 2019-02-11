import React, {
  forwardRef,
  useEffect,
  useContext,
  useCallback,
  useRef,
  useImperativeHandle,
} from 'react';
import debounce from 'lodash.debounce';
import { getMonth, getYear, format, addDays, differenceInDays } from 'date-fns';
import { VariableSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { getNow, isDebugInfoVisible } from '../shared/sharedUtils';
import { AppContext } from '../reducer';
import CalendarDay from './CalendarDay';
import useWindowSize from '../hooks/useWindowSize';
import {
  getCalendarTodos,
  subscribeToCalendarTodosUpdates,
} from './calendarAPI';
import {
  LOAD_MORE_COUNT,
  MAX_WIDTH,
  DEBUG_INFO_HEIGHT,
  HEADER_HEIGHT,
  FOOTER_HEIGHT,
  DATE_STR_FORMAT,
  CALENDAR_INITIAL_DAYS,
  TEMP_USER_SETTINGS_CALENDAR_DAYS_BACK,
} from '../constants';

function CalendarMain(_props, ref) {
  const { state, dispatchChange } = useContext(AppContext);
  const { user, today, firstCalendarDate, headerDate, calendarData } = state;
  const visibleDataIndices = useRef({
    start: null,
    stop: null,
  });
  const subscriptionRef = useRef(null);
  const listRef = useRef(null);
  const { width, height } = useWindowSize();
  const isItemLoaded = useCallback(
    index => {
      return calendarData[index] && calendarData[index].status != null;
    },
    [calendarData]
  );
  const getItemSize = useCallback(
    index => {
      const todosCount =
        calendarData[index] == null ? 0 : calendarData[index].todos.length;

      // ListHeader height = 32px
      // ListItem height = 48px
      return 32 + 48 * Math.max(1, todosCount);
    },
    [calendarData]
  );
  const itemKey = useCallback(
    index => {
      return format(calendarData[index].date, DATE_STR_FORMAT);
    },
    [calendarData]
  );
  const loadMoreItems = useCallback(
    (startIndex, stopIndex) => {
      const fromDate = addDays(firstCalendarDate, startIndex);
      const days = stopIndex - startIndex + 1;

      dispatchChange({
        type: 'ADD_EMPTY_CALENDAR_DAYS',
        fromDate,
        days,
        startIndex,
        stopIndex,
      });

      return getCalendarTodos({
        fromDate,
        days,
      })
        .then(todos => {
          dispatchChange({
            type: 'ADD_CALENDAR_TODOS',
            todos,
            startIndex,
            stopIndex,
          });

          if (listRef.current !== null) {
            listRef.current.resetAfterIndex(startIndex);
          }
        })
        .catch(error => {
          dispatchChange({
            type: 'FAILED_TO_LOAD_CALENDAR_TODOS',
            startIndex,
            stopIndex,
            errorMessage: error.message,
          });
        });
    },
    [firstCalendarDate]
  );
  const dayRenderer = ({ index, style }) => {
    const { date, todos, status } = calendarData[index];

    return (
      <CalendarDay date={date} status={status} todos={todos} style={style} />
    );
  };
  const onUpdate = useCallback(({ startIndex, stopIndex, todos }) => {
    dispatchChange({
      type: 'UPDATE_CALENDAR_TODOS',
      startIndex,
      stopIndex,
      todos,
    });

    if (listRef.current !== null) {
      listRef.current.resetAfterIndex(startIndex);
    }
  }, []);
  const onUpdateError = useCallback(error => {
    // Just swallowing the error here since Dialogs are not visible
    // to logged out users.
  }, []);
  const onScroll = useCallback(
    debounce(() => {
      if (subscriptionRef.current !== null) {
        subscriptionRef.current();
      }

      const startIndex = Math.max(0, visibleDataIndices.current.start - 7);
      const stopIndex = visibleDataIndices.current.stop + 7;
      const fromDate = addDays(firstCalendarDate, startIndex);
      const toDate = addDays(firstCalendarDate, stopIndex);

      subscriptionRef.current = subscribeToCalendarTodosUpdates({
        fromDate,
        toDate,
        startIndex,
        stopIndex,
        onUpdate,
        onError: onUpdateError,
      });
    }, 1000),
    [firstCalendarDate]
  );
  const scrollToToday = useCallback(() => {
    const todayIndex = differenceInDays(today, firstCalendarDate);

    listRef.current.scrollToItem(todayIndex, 'start');
  }, [today, firstCalendarDate]);

  // We expose `scrollToToday` so that when the Header title is clicked, we scroll to today.
  useImperativeHandle(ref, () => ({
    scrollToToday,
  }));

  useEffect(() => {
    const intervalID = setInterval(() => {
      dispatchChange({
        type: 'UPDATE_LAST_TODAY_CHECK',
        lastTodayCheck: getNow(),
      });

      dispatchChange({
        type: 'UPDATE_TODAY',
      });
    }, 60000); // 1 minute

    return () => {
      dispatchChange({
        type: 'UPDATE_LAST_TODAY_CHECK',
        lastTodayCheck: null,
      });

      clearInterval(intervalID);
    };
  }, []);

  useEffect(() => {
    const daysCount =
      TEMP_USER_SETTINGS_CALENDAR_DAYS_BACK + CALENDAR_INITIAL_DAYS;

    getCalendarTodos({
      fromDate: firstCalendarDate,
      days: daysCount,
    })
      .then(todos => {
        dispatchChange({
          type: 'ADD_CALENDAR_TODOS',
          todos,
          startIndex: 0,
          stopIndex: daysCount - 1,
        });
      })
      .catch(error => {
        dispatchChange({
          type: 'FAILED_TO_LOAD_CALENDAR_TODOS',
          startIndex: 0,
          stopIndex: daysCount - 1,
          errorMessage: error.message,
        });
      })
      .finally(scrollToToday);
  }, [firstCalendarDate]);

  useEffect(() => {
    return () => {
      if (subscriptionRef.current !== null) {
        subscriptionRef.current();
      }
    };
  }, []);

  return calendarData.length === 0 ? null : (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      loadMoreItems={loadMoreItems}
      itemCount={Number.MAX_SAFE_INTEGER}
      minimumBatchSize={LOAD_MORE_COUNT}
    >
      {({ onItemsRendered, ref }) => (
        <List
          height={
            height -
            (isDebugInfoVisible(user) ? DEBUG_INFO_HEIGHT : 0) -
            HEADER_HEIGHT -
            FOOTER_HEIGHT
          }
          width={Math.min(MAX_WIDTH, width)}
          itemCount={calendarData.length}
          itemSize={getItemSize}
          itemKey={itemKey}
          onItemsRendered={({ visibleStartIndex, visibleStopIndex }) => {
            visibleDataIndices.current = {
              start: visibleStartIndex,
              stop: visibleStopIndex,
            };

            onItemsRendered({
              visibleStartIndex,
              visibleStopIndex,
            });

            const { date } = calendarData[visibleStartIndex];

            if (
              getMonth(headerDate) !== getMonth(date) ||
              getYear(headerDate) !== getYear(date)
            ) {
              dispatchChange({
                type: 'UPDATE_CALENDAR_HEADER_DATE',
                headerDate: date,
              });
            }
          }}
          onScroll={onScroll}
          ref={list => {
            listRef.current = list;
            ref(list);
          }}
        >
          {dayRenderer}
        </List>
      )}
    </InfiniteLoader>
  );
}

export default forwardRef(CalendarMain);
