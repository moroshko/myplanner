// Hard coding everything here for now
import mishaPhotoUrl from './images/misha.jpeg';
import irinaPhotoUrl from './images/irina.jpeg';
import testuser1PhotoUrl from './images/testuser1.svg';
import testuser2PhotoUrl from './images/testuser2.svg';
import { getFirebaseAppNameFromLocalStorage } from './localStorage';
import { DEV_APP, TEST_APP, PROD_APP } from './constants';

function getUserGroup(userId) {
  const appName = getFirebaseAppNameFromLocalStorage(null);
  let users;

  switch (appName) {
    case DEV_APP: {
      users = [
        {
          uid: 'fAw83NgfymcEen8eZRq1LpLqc4H3',
          name: 'Misha Moroshko',
          photoUrl: mishaPhotoUrl,
        },
        {
          uid: 'WB3i7Gd227gIkvzuuo1ZAGBAJba2',
          name: 'Irina Moroshko',
          photoUrl: irinaPhotoUrl,
        },
      ];
      break;
    }

    case TEST_APP: {
      users = [
        {
          uid: 'oO1y4HbiixUIIKuFWWqhLIPOwjt1',
          name: 'Test User 1',
          photoUrl: testuser1PhotoUrl,
        },
        {
          uid: 'aFgG4kSr61YD4aJHKhT0ZnWVR743',
          name: 'Test User 2',
          photoUrl: testuser2PhotoUrl,
        },
      ];
      break;
    }

    case PROD_APP: {
      users = [
        {
          uid: 'HaQpA7srI9OLnrT2aHjNdkBx11f2',
          name: 'Misha Moroshko',
          photoUrl: mishaPhotoUrl,
        },
        {
          uid: '8jP5M8pSeraHiQxdjkTiGkAkSeB2',
          name: 'Irina Moroshko',
          photoUrl: irinaPhotoUrl,
        },
      ];
      break;
    }

    default: {
      throw new Error(`Unknown app name: ${appName}`);
    }
  }

  return Promise.resolve({
    users,
  });
}

export { getUserGroup };
