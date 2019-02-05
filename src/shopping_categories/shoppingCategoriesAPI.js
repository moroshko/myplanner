import { getDb } from '../firebase';
import { getShoppingItemsInCategory } from '../shopping_items/shoppingItemsAPI';
import { cleanShoppingCategoryName } from './shoppingCategoriesUtils';
import { pluralize } from '../shared/sharedUtils';

function getShoppingCategoriesCollection() {
  return getDb().collection('shopping_categories');
}

function createShoppingCategory({ name }) {
  return getDb().runTransaction(async transaction => {
    const cleanName = cleanShoppingCategoryName(name);
    const shoppingCategories = await getShoppingCategories();
    const alreadyExists = shoppingCategories.some(
      shoppingCategory => shoppingCategory.name === cleanName
    );

    if (alreadyExists) {
      throw new Error(`"${cleanName}" already exists.`);
    }

    const shoppingCategoriesCount = shoppingCategories.length;
    const newShoppingCategoryRef = getShoppingCategoriesCollection().doc();
    const newShoppingCategory = {
      name: cleanName,
      index: 0,
    };

    // move all the existing shopping categories (if they exist)
    for (let i = 0; i < shoppingCategoriesCount; i++) {
      const shoppingCategoryRef = getShoppingCategoriesCollection().doc(
        shoppingCategories[i].id
      );

      transaction.update(shoppingCategoryRef, {
        index: shoppingCategories[i].index + 1,
      });
    }

    // add the new shopping category
    transaction.set(newShoppingCategoryRef, newShoppingCategory);
  });
}

async function getShoppingCategory({ id }) {
  const shoppingCategoryRef = getShoppingCategoriesCollection().doc(id);
  const shoppingCategorySnapshot = await shoppingCategoryRef.get();

  return shoppingCategorySnapshot.exists
    ? getShoppingCategoryFromSnapshot(shoppingCategorySnapshot)
    : null;
}

// snapshot can be one of these:
//   - DocumentSnapshot
//   - QueryDocumentSnapshot
function getShoppingCategoryFromSnapshot(snapshot) {
  const { name, index } = snapshot.data();

  return {
    id: snapshot.id,
    name,
    index,
  };
}

function getShoppingCategoriesFromSnapshot(querySnapshot) {
  return querySnapshot.docs.map(getShoppingCategoryFromSnapshot);
}

function orderedShoppingCategories() {
  return getShoppingCategoriesCollection().orderBy('index', 'asc');
}

function getShoppingCategories() {
  return orderedShoppingCategories()
    .get()
    .then(getShoppingCategoriesFromSnapshot);
}

function updateShoppingCategoriesIndices(updates) {
  const batch = getDb().batch();

  updates.forEach(({ id, index }) => {
    batch.update(getShoppingCategoriesCollection().doc(id), { index });
  });

  return batch.commit();
}

function subscribeToShoppingCategoriesUpdates({ onUpdate, onError }) {
  return orderedShoppingCategories().onSnapshot(snapshot => {
    onUpdate({
      shoppingCategories: getShoppingCategoriesFromSnapshot(snapshot),
    });
  }, onError);
}

async function updateShoppingCategory({ id, name }) {
  const shoppingCategoryRef = getShoppingCategoriesCollection().doc(id);
  const shoppingCategorySnapshot = await shoppingCategoryRef.get();

  if (!shoppingCategorySnapshot.exists) {
    throw new Error("This shopping category doesn't exist anymore.");
  }

  return shoppingCategoryRef.update({
    name: cleanShoppingCategoryName(name),
  });
}

function deleteShoppingCategory({ id }) {
  return getDb().runTransaction(async transaction => {
    const shoppingItems = await getShoppingItemsInCategory(id);

    if (shoppingItems.length > 0) {
      throw new Error(
        `This shopping category can't be deleted because it has ${pluralize(
          shoppingItems.length,
          'item'
        )}.`
      );
    }

    const shoppingCategories = await getShoppingCategories();
    const shoppingCategoriesCount = shoppingCategories.length;
    const shoppingCategoryIndex = shoppingCategories.findIndex(
      shoppingCategory => shoppingCategory.id === id
    );

    if (shoppingCategoryIndex === -1) {
      throw new Error("This shopping category doesn't exist anymore.");
    }

    // move all the existing shopping categories after `shoppingCategoryIndex`
    for (let i = shoppingCategoryIndex + 1; i < shoppingCategoriesCount; i++) {
      const shoppingCategoryRef = getShoppingCategoriesCollection().doc(
        shoppingCategories[i].id
      );

      transaction.update(shoppingCategoryRef, {
        index: shoppingCategories[i].index - 1,
      });
    }

    // delete the shopping category itself
    const shoppingCategoryToDeleteRef = getShoppingCategoriesCollection().doc(
      id
    );

    transaction.delete(shoppingCategoryToDeleteRef);
  });
}

export {
  createShoppingCategory,
  getShoppingCategory,
  getShoppingCategories,
  updateShoppingCategoriesIndices,
  subscribeToShoppingCategoriesUpdates,
  updateShoppingCategory,
  deleteShoppingCategory,
};
