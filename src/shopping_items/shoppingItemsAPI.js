import groupBy from 'lodash.groupby';
import { db } from '../firebase';
import {
  getShoppingCategory,
  getShoppingCategories,
} from '../shopping_categories/shoppingCategoriesAPI';
import { getShoppingListItem } from '../shopping/shoppingListAPI';
import { cleanShoppingItemName } from './shoppingItemsUtils';

function getShoppingItemsCollection() {
  return db.collection('shopping_items');
}

async function validateShoppingItem({ id, name }) {
  let shoppingItemRef, cleanName;

  if (id != null) {
    shoppingItemRef = getShoppingItemsCollection().doc(id);

    const documentSnapshot = await shoppingItemRef.get();

    if (!documentSnapshot.exists) {
      throw new Error("This shopping item doesn't exist anymore.");
    }
  }

  if (name != null) {
    cleanName = cleanShoppingItemName(name);

    const querySnapshot = await getShoppingItemsCollection()
      .where('name', '==', cleanName)
      .get();

    if (querySnapshot.size > 0) {
      const { shoppingCategoryId } = querySnapshot.docs[0].data();
      const { name: categoryName } = await getShoppingCategory({
        id: shoppingCategoryId,
      });

      throw new Error(`"${cleanName}" already exists in "${categoryName}".`);
    }
  }

  return {
    shoppingItemRef,
    cleanName,
  };
}

async function createShoppingItem({ name, shoppingCategoryId }) {
  const { cleanName } = await validateShoppingItem({ name });

  return getShoppingItemsCollection().add({
    name: cleanName,
    shoppingCategoryId,
    popularity: 0,
  });
}

async function updateShoppingItem({ id, name, shoppingCategoryId }) {
  const { shoppingItemRef, cleanName } = await validateShoppingItem({
    id,
    name,
  });

  return shoppingItemRef.update({
    name: cleanName,
    shoppingCategoryId,
  });
}

async function getShoppingItem({ id }) {
  const shoppingItemRef = getShoppingItemsCollection().doc(id);
  const shoppingItemSnapshot = await shoppingItemRef.get();

  return shoppingItemSnapshot.exists
    ? getShoppingItemFromSnapshot(shoppingItemSnapshot)
    : null;
}

async function getShoppingItemInTransaction({ transaction, id }) {
  const shoppingItemRef = getShoppingItemsCollection().doc(id);
  const shoppingItemSnapshot = await transaction.get(shoppingItemRef);

  return shoppingItemSnapshot.exists
    ? {
        shoppingItemRef,
        ...getShoppingItemFromSnapshot(shoppingItemSnapshot),
      }
    : null;
}

// snapshot can be one of these:
//   - DocumentSnapshot
//   - QueryDocumentSnapshot
function getShoppingItemFromSnapshot(snapshot) {
  const { name, shoppingCategoryId, popularity } = snapshot.data();

  return {
    id: snapshot.id,
    name,
    shoppingCategoryId,
    popularity,
  };
}

function getShoppingItemsFromSnapshot(querySnapshot) {
  return querySnapshot.docs.map(getShoppingItemFromSnapshot);
}

async function getGroupedShoppingItemsFromSnapshot(snapshot) {
  const shoppingItems = getShoppingItemsFromSnapshot(snapshot);
  const shoppingCategories = await getShoppingCategories();
  const groupedItems = groupBy(shoppingItems, 'shoppingCategoryId');

  return shoppingCategories.reduce((acc, shoppingCategory) => {
    if (groupedItems[shoppingCategory.id]) {
      acc.push({
        shoppingCategory,
        shoppingItems: groupedItems[shoppingCategory.id],
      });
    }

    return acc;
  }, []);
}

function orderedShoppingItems() {
  return getShoppingItemsCollection()
    .orderBy('shoppingCategoryId', 'asc')
    .orderBy('name', 'asc');
}

function getGroupedShoppingItems() {
  return orderedShoppingItems()
    .get()
    .then(getGroupedShoppingItemsFromSnapshot);
}

function getShoppingItemsInCategory(shoppingCategoryId) {
  return getShoppingItemsCollection()
    .where('shoppingCategoryId', '==', shoppingCategoryId)
    .get()
    .then(getShoppingItemsFromSnapshot);
}

function subscribeToGroupedShoppingItemsUpdates({ onUpdate, onError }) {
  return orderedShoppingItems().onSnapshot(async snapshot => {
    const groupedShoppingItems = await getGroupedShoppingItemsFromSnapshot(
      snapshot
    );

    onUpdate({
      groupedShoppingItems,
    });
  }, onError);
}

async function deleteShoppingItem({ id }) {
  const shoppingItemRef = getShoppingItemsCollection().doc(id);
  const shoppingItemSnapshot = await shoppingItemRef.get();
  const { name } = shoppingItemSnapshot.data();

  if (!shoppingItemSnapshot.exists) {
    throw new Error(`Can't find "${name}" anymore.`);
  }

  const shoppingListItem = await getShoppingListItem({ shoppingItemId: id });

  if (shoppingListItem !== null) {
    throw new Error(
      `"${name}" can't be deleted because it's in the shopping list.`
    );
  }

  shoppingItemRef.delete();
}

export {
  createShoppingItem,
  updateShoppingItem,
  getShoppingItem,
  getShoppingItemInTransaction,
  getGroupedShoppingItems,
  getShoppingItemsInCategory,
  subscribeToGroupedShoppingItemsUpdates,
  deleteShoppingItem,
};
