import React, { useMemo, useContext } from 'react';
import { format } from 'date-fns';
import { Header, HeaderMenu } from '../shared/header-components';
import { AppContext } from '../reducer';

function CalendarHeader() {
  const { state } = useContext(AppContext);
  const { headerDate } = state;
  const title = useMemo(() => format(headerDate, 'MMMM yyyy'), [headerDate]);

  return (
    <Header title={title}>
      <HeaderMenu />
    </Header>
  );
}

export default CalendarHeader;
