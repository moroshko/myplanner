import React, { useMemo, useCallback, useContext } from 'react';
import Switch from 'react-switch';
import { getCssVariable, pluralize } from '../shared/sharedUtils';
import { Header, HeaderMenu } from '../shared/header-components';
import { AppContext } from '../reducer';
import { setIsShoppingToLocalStorage } from '../localStorage';
import './ShoppingHeader.css';

function ShoppingHeader() {
  const { state, dispatchChange } = useContext(AppContext);
  const { groupedShoppingListItems, isShopping } = state;
  const shoppingListHasItems =
    groupedShoppingListItems !== null && groupedShoppingListItems.length > 0;
  const onSwitchToggle = useCallback(isShopping => {
    dispatchChange({
      type: 'UPDATE_IS_SHOPPING',
      isShopping,
    });

    setIsShoppingToLocalStorage(isShopping);
  }, []);
  const title = useMemo(() => {
    if (!isShopping) {
      return 'Shopping List';
    }

    if (groupedShoppingListItems === null) {
      return '';
    }

    const listItemsCount = groupedShoppingListItems.reduce(
      (acc, { shoppingListItems }) => {
        const uncheckedListItemsCount = shoppingListItems.reduce(
          (acc, { checkTimestamp }) => {
            return acc + (checkTimestamp ? 0 : 1);
          },
          0
        );

        return acc + uncheckedListItemsCount;
      },
      0
    );

    return listItemsCount === 0
      ? 'All done!'
      : `${pluralize(listItemsCount, 'Item')} To Buy`;
  }, [groupedShoppingListItems, isShopping]);

  return (
    <Header title={title} highlighted={isShopping}>
      {shoppingListHasItems && (
        <Switch
          className="ShoppingHeaderSwitch"
          checked={isShopping}
          onChange={onSwitchToggle}
          uncheckedIcon={
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                color: getCssVariable('--grey-10'),
                marginRight: 14,
              }}
            >
              Add
            </div>
          }
          checkedIcon={
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                color: getCssVariable('--primary-100'),
                marginLeft: 14,
              }}
            >
              Shop
            </div>
          }
          width={80}
          offColor={'#1f2933' /* getCssVariable('--grey-100') */}
          offHandleColor={'#f5f7fa' /* getCssVariable('--grey-10') */}
          onColor={'#e5f9ff' /* getCssVariable('--primary-10') */}
          onHandleColor={'#035287' /* getCssVariable('--primary-100') */}
          activeBoxShadow="0px 0px 1px 8px rgba(0, 0, 0, 0.2)"
        />
      )}
      <HeaderMenu />
    </Header>
  );
}

export default ShoppingHeader;
