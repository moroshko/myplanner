// Hard coding everything here for now
import mishaPhotoUrl from './images/misha.jpeg';
import irinaPhotoUrl from './images/irina.jpeg';

function getUserGroup() {
  const users =
    process.env.NODE_ENV === 'production'
      ? [
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
        ]
      : [
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

  return Promise.resolve({
    users,
  });
}

export { getUserGroup };
