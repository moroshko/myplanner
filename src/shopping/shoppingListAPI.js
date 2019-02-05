import groupBy from 'lodash.groupby';
import sortBy from 'lodash.sortby';
import { getDb, getDeleteField } from '../firebase';
import {
  getShoppingItem,
  getShoppingItemInTransaction,
} from '../shopping_items/shoppingItemsAPI';
import { getShoppingCategory } from '../shopping_categories/shoppingCategoriesAPI';
import { cleanShoppingListItemNote } from './shoppingListItemsUtils';
import { timestamp } from '../shared/sharedUtils';

function getShoppingListItemsCollection() {
  return getDb().collection('shopping_list_items');
}

async function addShoppingListItem({ shoppingItemId }) {
  const querySnapshot = await getShoppingListItemsCollection()
    .where('shoppingItemId', '==', shoppingItemId)
    .get();

  if (querySnapshot.size > 0) {
    const { name } = await getShoppingItem({ id: shoppingItemId });

    throw new Error(`"${name}" already added.`);
  }

  return getShoppingListItemsCollection().add({
    shoppingItemId,
    note: '',
    checkTimestamp: null,
  });
}

async function getShoppingListItem({ shoppingItemId }) {
  const querySnapshot = await getShoppingListItemsCollection()
    .where('shoppingItemId', '==', shoppingItemId)
    .get();

  return querySnapshot.size === 0
    ? null
    : getShoppingListItemFromSnapshot(querySnapshot.docs[0]);
}

// snapshot can be one of these:
//   - DocumentSnapshot
//   - QueryDocumentSnapshot
function getShoppingListItemFromSnapshot(snapshot) {
  const { shoppingItemId, note, checkTimestamp } = snapshot.data();

  return {
    id: snapshot.id,
    shoppingItemId,
    note,
    checkTimestamp,
  };
}

function getShoppingListItemsFromSnapshot(snapshot) {
  return snapshot.docs.map(getShoppingListItemFromSnapshot);
}

async function getGroupedShoppingListItemsFromSnapshot(snapshot) {
  const shoppingListItems = getShoppingListItemsFromSnapshot(snapshot);
  const shoppingListItemsWithGroupInfo = await Promise.all(
    shoppingListItems.map(async shoppingListItem => {
      const { id, shoppingItemId, note, checkTimestamp } = shoppingListItem;
      const { name, shoppingCategoryId } = await getShoppingItem({
        id: shoppingItemId,
      });

      return {
        id,
        shoppingItemId,
        note,
        checkTimestamp,
        name,
        shoppingCategoryId,
      };
    })
  );
  const groupedShoppingListItems = groupBy(
    shoppingListItemsWithGroupInfo,
    'shoppingCategoryId'
  );
  const unsortedResult = await Promise.all(
    Object.keys(groupedShoppingListItems).map(async shoppingCategoryId => {
      const shoppingCategory = await getShoppingCategory({
        id: shoppingCategoryId,
      });

      return {
        shoppingCategory,
        shoppingListItems: groupedShoppingListItems[shoppingCategoryId],
      };
    })
  );

  return sortBy(unsortedResult, [
    ({ shoppingCategory }) => shoppingCategory.index,
  ]);
}

function orderedShoppingListItems() {
  // Currently, we don't order the shopping list items.
  // But, if we want to order them in the future, this is the place to add
  // the orderBy().
  return getShoppingListItemsCollection();
}

function getGroupedShoppingListItems() {
  return orderedShoppingListItems()
    .get()
    .then(getGroupedShoppingListItemsFromSnapshot);
}

function subscribeToGroupedShoppingListItemsUpdates({ onUpdate, onError }) {
  return orderedShoppingListItems().onSnapshot(async snapshot => {
    const groupedShoppingListItems = await getGroupedShoppingListItemsFromSnapshot(
      snapshot
    );

    onUpdate({
      groupedShoppingListItems,
    });
  }, onError);
}

async function updateShoppingListItemNote({ id, note }) {
  const shoppingListItemRef = getShoppingListItemsCollection().doc(id);
  const shoppingListItemSnapshot = await shoppingListItemRef.get();

  if (!shoppingListItemSnapshot.exists) {
    throw new Error("This shopping list item doesn't exist anymore.");
  }

  const cleanNote = cleanShoppingListItemNote(note);

  return shoppingListItemRef.update({
    note: cleanNote ? cleanNote : getDeleteField()(),
  });
}

async function checkShoppingListItem({ id }) {
  const shoppingListItemRef = getShoppingListItemsCollection().doc(id);
  const shoppingListItemSnapshot = await shoppingListItemRef.get();

  if (!shoppingListItemSnapshot.exists) {
    throw new Error("This shopping list item doesn't exist anymore.");
  }

  return shoppingListItemRef.update({
    checkTimestamp: timestamp(),
  });
}

async function uncheckShoppingListItem({ id }) {
  const shoppingListItemRef = getShoppingListItemsCollection().doc(id);
  const shoppingListItemSnapshot = await shoppingListItemRef.get();

  if (!shoppingListItemSnapshot.exists) {
    throw new Error("This shopping list item doesn't exist anymore.");
  }

  return shoppingListItemRef.update({
    checkTimestamp: null,
  });
}

async function deleteShoppingListItem({ id }) {
  const shoppingListItemRef = getShoppingListItemsCollection().doc(id);
  const shoppingListItemSnapshot = await shoppingListItemRef.get();

  if (!shoppingListItemSnapshot.exists) {
    throw new Error("This shopping list item doesn't exist anymore.");
  }

  shoppingListItemRef.delete();
}

async function deleteAllCheckedShoppingListItems() {
  const shoppingListItems = await orderedShoppingListItems()
    .get()
    .then(getShoppingListItemsFromSnapshot);
  const checkedShoppingListItems = shoppingListItems.filter(
    ({ checkTimestamp }) => checkTimestamp !== null
  );
  const uncheckedCount =
    shoppingListItems.length - checkedShoppingListItems.length;

  return getDb().runTransaction(async transaction => {
    const shoppingItems = await Promise.all(
      checkedShoppingListItems.map(
        async ({ shoppingItemId }) =>
          await getShoppingItemInTransaction({
            transaction,
            id: shoppingItemId,
          })
      )
    );

    shoppingItems.forEach(({ shoppingItemRef, popularity }) => {
      transaction.update(shoppingItemRef, { popularity: popularity + 1 });
    });

    checkedShoppingListItems.forEach(({ id }) => {
      const shoppingListItemRef = getShoppingListItemsCollection().doc(id);

      transaction.delete(shoppingListItemRef);
    });

    return uncheckedCount;
  });
}

export {
  addShoppingListItem,
  getShoppingListItem,
  getGroupedShoppingListItems,
  subscribeToGroupedShoppingListItemsUpdates,
  updateShoppingListItemNote,
  checkShoppingListItem,
  uncheckShoppingListItem,
  deleteShoppingListItem,
  deleteAllCheckedShoppingListItems,
};
