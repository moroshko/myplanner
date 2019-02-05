import React, { useCallback, useContext } from 'react';
import DraggableList from '../shared/DraggableList';
import EmptyMessage from '../shared/EmptyMessage';
import ShoppingCategory from './ShoppingCategory';
import { updateShoppingCategoriesIndices } from './shoppingCategoriesAPI';
import { AppContext } from '../reducer';
import { NEW_SHOPPING_CATEGORY_DIALOG, ERROR_DIALOG } from '../constants';

function ShoppingCategoriesList({ shoppingCategories }) {
  const { dispatchChange } = useContext(AppContext);
  const onAddShoppingCategoryClick = useCallback(() => {
    dispatchChange({
      type: 'SHOW_DIALOG',
      dialogName: NEW_SHOPPING_CATEGORY_DIALOG,
    });
  }, []);
  const onDragEnd = useCallback(
    ({ source, destination }) => {
      if (destination === null || destination.index === source.index) {
        return;
      }

      const updates = [];

      if (source.index < destination.index) {
        for (
          let index = source.index + 1;
          index <= destination.index;
          index++
        ) {
          updates.push({
            id: shoppingCategories[index].id,
            index: shoppingCategories[index].index - 1,
          });
        }

        updates.push({
          id: shoppingCategories[source.index].id,
          index: destination.index,
        });
      } else {
        for (let index = destination.index; index < source.index; index++) {
          updates.push({
            id: shoppingCategories[index].id,
            index: shoppingCategories[index].index + 1,
          });
        }

        updates.push({
          id: shoppingCategories[source.index].id,
          index: destination.index,
        });
      }

      dispatchChange({
        type: 'OPTIMISTICALLY_UPDATE_SHOPPING_CATEGORIES_INDICES',
        sourceIndex: source.index,
        destinationIndex: destination.index,
      });

      updateShoppingCategoriesIndices(updates).catch(error => {
        dispatchChange({
          type: 'SHOW_DIALOG',
          dialogName: ERROR_DIALOG,
          dialogData: {
            errorMessage: error.message,
            onClose: () => {
              // This will revert the optimistic update above.
              dispatchChange({
                type: 'OPTIMISTICALLY_UPDATE_TODOS_INDICES',
                sourceIndex: destination.index,
                destinationIndex: source.index,
              });
            },
          },
        });
      });
    },
    [shoppingCategories]
  );

  return shoppingCategories.length === 0 ? (
    <EmptyMessage
      buttonText="Add Category"
      onButtonClick={onAddShoppingCategoryClick}
    >
      You don't have any categories yet.
    </EmptyMessage>
  ) : (
    <DraggableList droppableId="shopping-categories" onDragEnd={onDragEnd}>
      {shoppingCategories.map(shoppingCategory => (
        <ShoppingCategory
          shoppingCategory={shoppingCategory}
          isDraggable={shoppingCategories.length > 1}
          key={shoppingCategory.id}
        />
      ))}
    </DraggableList>
  );
}

export default ShoppingCategoriesList;
