import React, { useMemo, useContext } from 'react';
import { format } from 'date-fns';
import { Header, HeaderMenu } from '../shared/header-components';
import { AppContext } from '../reducer';

function CalendarHeader({ onTitleClick }) {
  const { state } = useContext(AppContext);
  const { headerDate } = state;
  const title = useMemo(() => format(headerDate, 'MMMM yyyy'), [headerDate]);

  return (
    <Header title={title} onTitleClick={onTitleClick}>
      <HeaderMenu />
    </Header>
  );
}

export default CalendarHeader;
