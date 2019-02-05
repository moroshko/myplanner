import React, { useEffect, useContext, useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';
import { getMonth, getYear, format, addDays, isSameDay } from 'date-fns';
import { VariableSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { getNow, getToday, isDebugInfoVisible } from '../shared/sharedUtils';
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
} from '../constants';

function CalendarMain() {
  const { state, dispatchChange } = useContext(AppContext);
  const { user, today, headerDate, calendarData } = state;
  const visibleDataIndices = useRef({
    start: null,
    stop: null,
  });
  const subscriptionRef = useRef(null);
  const listRef = useRef(null);
  const { width, height } = useWindowSize();
  const isItemLoaded = index => {
    return calendarData[index] && calendarData[index].status != null;
  };
  const getItemSize = index => {
    const todosCount =
      calendarData[index] == null ? 0 : calendarData[index].todos.length;

    // ListHeader height = 32px
    // ListItem height = 48px
    return 32 + 48 * Math.max(1, todosCount);
  };
  const itemKey = index => {
    return format(calendarData[index].date, DATE_STR_FORMAT);
  };
  const loadMoreItems = (startIndex, stopIndex) => {
    const fromDate = addDays(today, startIndex);
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
  };
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
      const fromDate = addDays(today, startIndex);
      const toDate = addDays(today, stopIndex);

      subscriptionRef.current = subscribeToCalendarTodosUpdates({
        fromDate,
        toDate,
        startIndex,
        stopIndex,
        onUpdate,
        onError: onUpdateError,
      });
    }, 1000),
    []
  );

  useEffect(() => {
    const intervalID = setInterval(() => {
      dispatchChange({
        type: 'UPDATE_LAST_TODAY_CHECK',
        lastTodayCheck: getNow(),
      });

      if (!isSameDay(calendarData[0].date, getToday())) {
        dispatchChange({
          type: 'UPDATE_TODAY',
        });

        if (listRef.current !== null) {
          listRef.current.resetAfterIndex(0);
        }
      }
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
    return () => {
      if (subscriptionRef.current !== null) {
        subscriptionRef.current();
      }
    };
  }, []);

  return (
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

export default CalendarMain;
