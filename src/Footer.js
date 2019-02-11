import React, { useCallback, useContext } from 'react';
import classNames from 'classnames';
import { CalendarIcon, TodosIcon, ShoppingIcon } from './icons';
import { AppContext } from './reducer';
import { setActivePageToLocalStorage } from './localStorage';
import {
  FOOTER_HEIGHT,
  CALENDAR_PAGE,
  TODOS_PAGE,
  SHOPPING_PAGE,
} from './constants';
import './Footer.css';

function Footer() {
  const { state, dispatchChange } = useContext(AppContext);
  const { activePage, backButtonPage } = state;
  const isCalendarActive =
    activePage === CALENDAR_PAGE || backButtonPage === CALENDAR_PAGE;
  const isTodosActive =
    activePage === TODOS_PAGE || backButtonPage === TODOS_PAGE;
  const isShoppingActive =
    activePage === SHOPPING_PAGE || backButtonPage === SHOPPING_PAGE;
  const onCalendarButtonClick = useCallback(() => {
    dispatchChange({
      type: 'UPDATE_ACTIVE_PAGE',
      activePage: CALENDAR_PAGE,
    });

    setActivePageToLocalStorage(CALENDAR_PAGE);
  }, []);
  const onTodosButtonClick = useCallback(() => {
    dispatchChange({
      type: 'UPDATE_ACTIVE_PAGE',
      activePage: TODOS_PAGE,
    });

    setActivePageToLocalStorage(TODOS_PAGE);
  }, []);
  const onShoppingButtonClick = useCallback(() => {
    dispatchChange({
      type: 'UPDATE_ACTIVE_PAGE',
      activePage: SHOPPING_PAGE,
    });

    setActivePageToLocalStorage(SHOPPING_PAGE);
  }, []);

  return (
    <div
      className="Footer"
      style={{ height: FOOTER_HEIGHT - 1 /* border top */ }}
    >
      <button
        className={classNames('FooterButton', {
          FooterButtonActive: isCalendarActive,
        })}
        onClick={onCalendarButtonClick}
      >
        <CalendarIcon highlighted={isCalendarActive} />
        <span>Calendar</span>
      </button>
      <button
        className={classNames('FooterButton', {
          FooterButtonActive: isTodosActive,
        })}
        onClick={onTodosButtonClick}
      >
        <TodosIcon highlighted={isTodosActive} />
        <span>Todos</span>
      </button>
      <button
        className={classNames('FooterButton', {
          FooterButtonActive: isShoppingActive,
        })}
        onClick={onShoppingButtonClick}
      >
        <ShoppingIcon highlighted={isShoppingActive} />
        <span>Shopping</span>
      </button>
    </div>
  );
}

export default Footer;
