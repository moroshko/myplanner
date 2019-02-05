import firebase from 'firebase/app';
import('firebase/firestore');

/*
  The code below copies all data from one app to another.
  To run the code:
    1. Update PASSWORD
    2. In App.js, uncomment import './tempFirebaseHack';
*/

const PASSWORD = ''; // Put real password here to run the code, but don't check it in!

copyAllData({
  from: 'daily-planner',
  to: 'myplanner-prod',
});

function init(appName) {
  switch (appName) {
    case 'test-daily-planner': {
      firebase.initializeApp(
        {
          apiKey: 'AIzaSyCZJ8A_lWpbQOElpE3SawgKE-i7WsM2RQc',
          authDomain: 'moroshko-test-daily-planner.firebaseapp.com',
          databaseURL: 'https://moroshko-test-daily-planner.firebaseio.com',
          projectId: 'moroshko-test-daily-planner',
          storageBucket: 'moroshko-test-daily-planner.appspot.com',
          messagingSenderId: '95910089957',
        },
        appName
      );
      break;
    }

    case 'daily-planner': {
      firebase.initializeApp(
        {
          apiKey: 'AIzaSyDQogZlnllVdLtZlq9TEg0UEn7J2N_m9pg',
          authDomain: 'moroshko-daily-planner.firebaseapp.com',
          databaseURL: 'https://moroshko-daily-planner.firebaseio.com',
          projectId: 'moroshko-daily-planner',
          storageBucket: 'moroshko-daily-planner.appspot.com',
          messagingSenderId: '276079779360',
        },
        appName
      );
      break;
    }

    case 'myplanner-dev': {
      firebase.initializeApp(
        {
          apiKey: 'AIzaSyCPl3KLslx0XMmP8ryroxz35QNmIMrz9B0',
          authDomain: 'myplanner-dev-96028.firebaseapp.com',
          databaseURL: 'https://myplanner-dev-96028.firebaseio.com',
          projectId: 'myplanner-dev-96028',
          storageBucket: 'myplanner-dev-96028.appspot.com',
          messagingSenderId: '166357028703',
        },
        appName
      );
      break;
    }

    case 'myplanner-prod': {
      firebase.initializeApp(
        {
          apiKey: 'AIzaSyDOI8oFqOVimf5s_GgV3YG39pchDWBZvOU',
          authDomain: 'myplanner-prod-54a89.firebaseapp.com',
          databaseURL: 'https://myplanner-prod-54a89.firebaseio.com',
          projectId: 'myplanner-prod-54a89',
          storageBucket: 'myplanner-prod-54a89.appspot.com',
          messagingSenderId: '83446074912',
        },
        appName
      );
      break;
    }

    default: {
      throw new Error(`Unknown app: ${appName}`);
    }
  }

  const app = firebase.app(appName);

  return {
    db: app.firestore(),
    auth: app.auth(),
  };
}

function login(auth) {
  return auth.signInWithEmailAndPassword(
    'michael.moroshko@gmail.com',
    PASSWORD
  );
}

function isCollectionEmpty(db, collectionName) {
  return db
    .collection(collectionName)
    .get()
    .then(snapshot => snapshot.size === 0);
}

function readCollection(db, collectionName, fields) {
  return db
    .collection(collectionName)
    .get()
    .then(snapshot => {
      return snapshot.docs.map(doc => {
        return fields.reduce(
          (acc, field) => {
            acc[field] = doc.data()[field];
            return acc;
          },
          { id: doc.id }
        );
      });
    });
}

async function writeCollection(db, collectionName, data) {
  const isEmpty = await isCollectionEmpty(db, collectionName);

  if (!isEmpty) {
    console.log(`${collectionName} already exist`);

    return Promise.resolve();
  }

  const batch = db.batch();

  data.forEach(({ id, ...rest }) => {
    batch.set(db.collection(collectionName).doc(id), rest);
  });

  return batch
    .commit()
    .then(() => {
      console.log(`${collectionName} written successfully`);
    })
    .catch(error => {
      console.log(`Error when writing ${collectionName}:`, error.message);
    });
}

const collections = [
  {
    collectionName: 'calendar',
    fields: ['dateStr', 'timeStr', 'description'],
  },
  {
    collectionName: 'todos',
    fields: ['description', 'index', 'ownerUid'],
  },
  {
    collectionName: 'shopping_categories',
    fields: ['index', 'name'],
  },
  {
    collectionName: 'shopping_items',
    fields: ['name', 'popularity', 'shoppingCategoryId'],
  },
  {
    collectionName: 'shopping_list_items',
    fields: ['shoppingItemId', 'note', 'checkTimestamp'],
  },
];

async function copyAllData({ from, to }) {
  const { auth: fromAuth, db: fromDb } = init(from);
  const { auth: toAuth, db: toDb } = init(to);

  await login(fromAuth);
  await login(toAuth);

  collections.forEach(async ({ collectionName, fields }) => {
    await writeCollection(
      toDb,
      collectionName,
      await readCollection(fromDb, collectionName, fields)
    );
  });
}
