import React, { useCallback, useContext } from 'react';
import classNames from 'classnames';
import { LeftArrowIcon } from '../../icons';
import { AppContext } from '../../reducer';
import { HEADER_HEIGHT } from '../../constants';
import './Header.css';

function Header({ title, highlighted, withBackButtonTo, children }) {
  const { dispatchChange } = useContext(AppContext);
  const onBackButtonClick = useCallback(() => {
    dispatchChange({
      type: 'UPDATE_ACTIVE_PAGE',
      activePage: withBackButtonTo,
    });
  }, [withBackButtonTo]);

  return (
    <div
      className={classNames('Header', {
        HeaderHighlighted: highlighted,
      })}
      style={{ height: HEADER_HEIGHT - 32 /* padding */ }}
    >
      {withBackButtonTo && (
        <button className="HeaderBackButton" onClick={onBackButtonClick}>
          <LeftArrowIcon backgroundType="dark" />
        </button>
      )}
      <div className="HeaderTitle">{title}</div>
      <div className="HeaderButtonsContainer">{children}</div>
    </div>
  );
}

export default Header;
