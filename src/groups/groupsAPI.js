import { db } from '../firebase';
import { isGroupValid, cleanGroupName } from './groupsUtils';

function getGroupsCollection() {
  return db.collection('groups');
}

async function createGroup({ name }) {
  const cleanName = cleanGroupName(name);

  if (!isGroupValid({ name: cleanName })) {
    throw new Error(
      'Group name can contain a-z and _ only, must start with a letter, and have at least 2 characters.'
    );
  }

  const querySnapshot = await getGroupsCollection()
    .where('name', '==', cleanName)
    .get();

  if (querySnapshot.size > 0) {
    throw new Error(`"${cleanName}" already exists.`);
  }

  return getGroupsCollection().add({
    name: cleanName,
  });
}

// snapshot can be one of these:
//   - DocumentSnapshot
//   - QueryDocumentSnapshot
function getGroupFromSnapshot(snapshot) {
  const { name } = snapshot.data();

  return {
    id: snapshot.id,
    name,
  };
}

function getGroupsFromSnapshot(querySnapshot) {
  return querySnapshot.docs.map(getGroupFromSnapshot);
}

function orderedGroups() {
  return getGroupsCollection().orderBy('name', 'asc');
}

function getGroups() {
  return orderedGroups()
    .get()
    .then(getGroupsFromSnapshot);
}

function subscribeToGroupsUpdates({ onUpdate }) {
  return orderedGroups().onSnapshot(snapshot => {
    onUpdate({
      groups: getGroupsFromSnapshot(snapshot),
    });
  });
}

export { createGroup, getGroups, subscribeToGroupsUpdates };
