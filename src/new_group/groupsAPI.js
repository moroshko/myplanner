import { getDb } from '../firebase';
import { isGroupValid, cleanGroupName } from './groupsUtils';

function getGroupsCollection() {
  return getDb().collection('groups');
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

export { createGroup };
