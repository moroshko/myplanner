import { db } from '../firebase';
import { cleanGroupName } from './groupsUtils';

function getGroupsCollection() {
  return db.collection('groups');
}

async function validateGroup({ id, name }) {
  let groupRef, cleanName;

  if (id != null) {
    groupRef = getGroupsCollection().doc(id);

    const documentSnapshot = await groupRef.get();

    if (!documentSnapshot.exists) {
      throw new Error("This group doesn't exist anymore.");
    }
  }

  if (name != null) {
    cleanName = cleanGroupName(name);

    const querySnapshot = await getGroupsCollection()
      .where('name', '==', cleanName)
      .get();

    if (querySnapshot.size > 0) {
      throw new Error(`"${cleanName}" already exists.`);
    }
  }

  return {
    groupRef,
    cleanName,
  };
}

async function createGroup({ name }) {
  const { cleanName } = await validateGroup({ name });

  return getGroupsCollection().add({
    name: cleanName,
  });
}

async function updateGroup({ id, name }) {
  const { groupRef } = await validateGroup({ id, name });

  return groupRef.update({
    name: cleanGroupName(name),
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

export { createGroup, updateGroup, getGroups, subscribeToGroupsUpdates };
