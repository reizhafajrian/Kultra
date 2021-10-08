// import app from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  distanceBetween,
  geohashForLocation,
  geohashQueryBounds,
} from 'geofire-common';
import data from '../../data.json';
//create firebase auth create user
export const signUp = async (email, password, name, phone) => {
  const res = await auth()
    .createUserWithEmailAndPassword(email, password)
    .then(result => result)
    .catch(err => {
      throw err;
    });

  const createUser = firestore().collection('users').doc(res.user.uid).set({
    name,
    phone,
  });
  return createUser;
};

export const signIn = (email, password) => {
  return auth()
    .signInWithEmailAndPassword(email, password)
    .then(res => res)
    .catch(err => {
      console.log(err);
      throw err;
    });
};
export const signOut = () => {
  return auth().signOut();
};
export const checkCurrentUser = () => {
  return auth().currentUser;
};
export const getResto = temp => {
  console.log(typeof temp);
  if (temp !== null) {
    return firestore()
      .collection('resto')
      .limit(26)
      .startAfter(temp)
      .get()
      .then(res =>
        res.docs.map(doc => {
          const response = {
            data: doc.data(),
            last: doc,
            id: doc.id,
          };
          return response;
        }),
      )
      .catch(err => {
        throw err;
      });
  }
  return firestore()
    .collection('resto')
    .limit(26)
    .get()
    .then(res =>
      res.docs.map(doc => {
        const response = {
          data: doc.data(),
          last: doc,
          id: doc.id,
        };
        return response;
      }),
    )
    .catch(err => {
      throw err;
    });
};

export const createResto = data => {
  data.thumbnail =
    'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg';
  data.image = [
    'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg',
    'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg',
    'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg',
  ];
  data.Latitude = Number(data.Latitude);
  data.Longitude = Number(data.Longitude);
  data.geohash = geohashForLocation([data.Latitude, data.Longitude]);
  return firestore()
    .collection('resto')
    .add(data)
    .then(res => res)
    .catch(err => {
      console.log(err);
      throw err;
    });
};

export const postComment = async (id, datas) => {
  try {
    const res = await firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .collection('comment')
      .add(datas);

    return await firestore()
      .collection('resto')
      .doc(id)
      .collection('comment')
      .add({
        ref: res.path,
      });
  } catch (error) {
    throw error;
  }
};
export const currentUser = () => {
  return auth().currentUser;
};
export const getCommentResto = id => {
  return firestore()
    .collection('resto')
    .doc(id)
    .collection('comment')
    .get()
    .then(res => res.docs.map(doc => doc.data()));
};
export const getDataFromRef = path => {
  return firestore()
    .doc(String(path))
    .get()
    .then(res => res.data())
    .then(res => {
      console.log(path);
      return res;
    });
};
export const nearbyResto = async () => {
  // return firestore()
  //   .collection('resto')
  //   .orderBy('geohash')
  //   .startAt(b[0])
  //   .endAt(b[1])
  //   .get()
  //   .then(res => res.docs.map(doc => doc.data()));
  const center = [-6.180454, 106.721126];
  const radiusInM = 4 * 1000;
  const bounds = geohashQueryBounds(center, radiusInM);
  const promises = [];

  for (const b of bounds) {
    const q = firestore()
      .collection('resto')
      .orderBy('geohash')
      .startAt(b[0])
      .endAt(b[1])
      .get();

    promises.push(q);
  }
  // }
  return Promise.all(promises)
    .then(snapshots => {
      const matchingDocs = [];
      for (const snap of snapshots) {
        for (const doc of snap.docs) {
          const lat = doc.get('Latitude');
          const lng = doc.get('Longitude');
          const distanceInKm = distanceBetween([lat, lng], center);
          const distanceInM = distanceInKm * 1000;
          if (distanceInM <= radiusInM) {
            matchingDocs.push(doc);
          }
        }
      }
      return matchingDocs;
    })
    .then(matchingDocs => {
      return matchingDocs.map(doc => doc.data());
      // Process the matching documents
      // ...
    });
};
