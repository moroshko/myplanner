import { db } from '../firebase';
import { getShoppingItemsInCategory } from '../shopping_items/shoppingItemsAPI';
import { cleanShoppingCategoryName } from './shoppingCategoriesUtils';
import { pluralize } from '../shared/sharedUtils';

function getShoppingCategoriesCollection() {
  return db.collection('shopping_categories');
}

async function validateShoppingCategory({ id, name }) {
  let shoppingCategoryRef, cleanName;

  if (id != null) {
    shoppingCategoryRef = getShoppingCategoriesCollection().doc(id);

    const documentSnapshot = await shoppingCategoryRef.get();

    if (!documentSnapshot.exists) {
      throw new Error("This shopping category doesn't exist anymore.");
    }
  }

  if (name != null) {
    cleanName = cleanShoppingCategoryName(name);

    const querySnapshot = await getShoppingCategoriesCollection()
      .where('name', '==', cleanName)
      .get();

    if (querySnapshot.size > 0) {
      throw new Error(`"${cleanName}" already exists.`);
    }
  }

  return {
    shoppingCategoryRef,
    cleanName,
  };
}

async function createShoppingCategory({ name }) {
  return db.runTransaction(async transaction => {
    const { cleanName } = await validateShoppingCategory({ name });
    const shoppingCategories = await getShoppingCategories();
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

async function updateShoppingCategory({ id, name }) {
  const { shoppingCategoryRef, cleanName } = await validateShoppingCategory({
    id,
    name,
  });

  return shoppingCategoryRef.update({
    name: cleanName,
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
  const batch = db.batch();

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

function deleteShoppingCategory({ id }) {
  return db.runTransaction(async transaction => {
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
  updateShoppingCategory,
  getShoppingCategory,
  getShoppingCategories,
  updateShoppingCategoriesIndices,
  subscribeToShoppingCategoriesUpdates,
  deleteShoppingCategory,
};
