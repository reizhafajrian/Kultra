// import app from '@react-native-firebase/app';
import auth, {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {
  distanceBetween,
  geohashForLocation,
  geohashQueryBounds,
} from 'geofire-common';
import data from '../../data.json';
import food from '../../datamakanan.json';
import datamakanan from '../../data_makana.json';
//create firebase auth create user

export const signUp = async (email, password, name, phone) => {
  const res = await auth()
    .createUserWithEmailAndPassword(email, password)
    .then(result => result)
    .catch(err => {
      throw err;
    });
  const display = auth()
    .currentUser.updateProfile({
      displayName: name,
    })
    .catch(err => {
      return false;
    });
  if (res && display) {
    const createUser = firestore().collection('users').doc(res.user.uid).set({
      name,
      phone,
    });
    return createUser;
  }
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
export const getResto = async temp => {
  let res = [];

  if (temp !== null) {
    res = await firestore()
      .collection('restaurant')
      // .limit(26)
      // .startAfter(temp)
      .get()
      .then(res => {
        return res.docs.map(async doc => {
          const response = {
            data: doc.data(),
            last: doc,
            id: doc.id,
          };

          return response;
        });
      })
      .catch(err => {
        throw err;
      });
  }
  if (temp === null) {
    res = await firestore()
      .collection('restaurant')

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

  for (const i in res) {
    res[i].comment = await getCommentResto(res[i].id);
    if (res[i].comment.length > 0) {
      let rate = 0;
      for (const kay in res[i].comment) {
        const test = await getDataFromRef(res[i].comment[kay].ref);
        rate += test.item.rating;
      }
      res[i].rate = rate / res[i].comment.length;
    } else {
      res[i].rate = 0;
    }
  }

  return Promise.all(res);
};
export const getAllResto = async () => {
  const res = await firestore()
    .collection('restaurant')
    .get()
    .then(res =>
      res.docs.map(doc => {
        const response = {
          data: doc.data(),
          id: doc.id,
          // rate: getRate(doc.id),
        };
        return response;
      }),
    )
    .catch(err => {
      throw err;
    });

  for (const i in res) {
    res[i].comment = await getCommentResto(res[i].id);
    if (res[i].comment.length > 0) {
      let rate = 0;
      for (const kay in res[i].comment) {
        const test = await getDataFromRef(res[i].comment[kay].ref);
        rate += test.item.rating;
      }
      res[i].rate = rate / res[i].comment.length;
    }
  }
  return res;
};

export const createResto = data => {
  data.thumbnail =
    'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg';
  data.image = [
    'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg',
    'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg',
    'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg',
  ];
  data.latitude = Number(data.latitude);
  data.longitude = Number(data.longitude);
  data.geohash = geohashForLocation([data.latitude, data.longitude]);
  return firestore()
    .collection('restaurant')
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
      .collection('restaurant')
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
    .collection('restaurant')
    .doc(id)
    .collection('comment')
    .get()
    .then(res => res.docs.map(doc => doc.data()));
};
export const getDataFromRef = path => {
  return firestore()
    .doc(String(path))
    .get()
    .then(res => {
      const response = {
        item: res.data(),
        last: res,
        id: res.id,
      };
      return response;
    })
    .then(res => {
      return res;
    });
};
export const nearbyResto = async data => {
  const center = [data.lat, data.long];
  const radiusInM = 10 * 1000;
  const bounds = geohashQueryBounds(center, radiusInM);
  const promises = [];
  console.log(data);
  for (const b of bounds) {
    const q = firestore()
      .collection('restaurant')
      .orderBy('geohash')
      .startAt(b[0])
      .endAt(b[1])
      .get();

    promises.push(q);
  }

  const temp = await Promise.all(promises)
    .then(snapshots => {
      const matchingDocs = [];
      for (const snap of snapshots) {
        for (const doc of snap.docs) {
          const lat = doc.get('latitude');
          const lng = doc.get('longitude');
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
      return matchingDocs.map(doc => {
        const response = {
          item: doc.data(),
          last: doc,
          id: doc.id,
        };
        return response;
      });
    });
  for (const key in temp) {
    temp[key].comment = await getCommentResto(temp[key].id);
    if (temp[key].comment.length > 0) {
      let rate = 0;
      for (const kay in temp[key].comment) {
        const test = await getDataFromRef(temp[key].comment[kay].ref);
        rate += test.item.rating;
      }
      temp[key].rate = rate / temp[key].comment.length;
    }
  }
  console.log(temp, 'nearby');
  return temp;
};

export const addBookmark = async id => {
  return firestore()
    .collection('users')
    .doc(currentUser().uid)
    .collection('bookmark')
    .add({
      path: `restaurant/${id}`,
    })
    .then(res => true)
    .catch(err => {
      console.log(err);
      return false;
    });
};
export const deleteBookMark = async id => {
  return await firestore()
    .collection('users')
    .doc(currentUser().uid)
    .collection('bookmark')
    .where('path', '==', `restaurant/${id}`)
    .get()
    .then(res =>
      res.docs.map(doc => {
        try {
          doc.ref.delete();
          return true;
        } catch (error) {
          return false;
        }
      }),
    )
    .catch(err => {
      console.log(err);
    });
};
export const findBookMark = id => {
  return firestore()
    .collection('users')
    .doc(currentUser().uid)
    .collection('bookmark')
    .where('path', '==', `restaurant/${id}`)
    .get()
    .then(res => {
      if (res.empty) {
        return false;
      }
      return true;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

export const getDataSavedFirebase = async () => {
  let result = await firestore()
    .collection('users')
    .doc(currentUser().uid)
    .collection('bookmark')
    .get()
    .then(res => {
      const data = res.docs.map(doc => doc.data());
      return data;
    });
  return result;
};
export const lengthOfBookmark = async () => {
  return firestore()
    .collection('users')
    .doc(currentUser().uid)
    .collection('bookmark')
    .get()
    .then(res => res.docs.length)
    .catch(err => {
      console.log(err);
      throw err;
    });
};
export const lengthOfComment = async () => {
  return firestore()
    .collection('users')
    .doc(currentUser().uid)
    .collection('comment')
    .get()
    .then(res => res.docs.length)
    .catch(err => {
      console.log(err);
      throw err;
    });
};
export const searchResto = async keyword => {
  const temp = await firestore()
    .collection('restaurant')
    .orderBy('nama_restoran')
    .startAt(keyword)
    .endAt(keyword + '\uf8ff')
    .limit(10)
    .get()
    .then(res => {
      return res.docs.map(doc => {
        const item = {item: doc.data(), last: doc, id: doc.id};
        return item;
      });
    });

  for (const key in temp) {
    const test = await getCommentResto(temp[key].id);
    temp[key].comment = test;
  }
  let rate = 0;
  for (const key in temp) {
    if (
      typeof temp[key].comment !== 'undefined' &&
      temp[key].comment.length > 0
    ) {
      for (const kay in temp[key].comment) {
        const test = await getDataFromRef(temp[key].comment[kay].ref);
        rate += test.item.rating;
      }
    }

    temp[key].rate = rate / temp[key].comment.length;
  }

  return temp;
};

export const changePasswordAuth = async (oldPassword, newPassword) => {
  const emailCred = auth.EmailAuthProvider.credential(
    auth().currentUser.email,
    oldPassword,
  );

  return auth()
    .currentUser.reauthenticateWithCredential(emailCred)
    .then(() => {
      return auth()
        .currentUser.updatePassword(newPassword)
        .then(() => true)
        .catch(err => false);
    })
    .catch(error => {
      console.log(error);
    });
};
export const changeProfileFirebase = async (name, photoURL, phone, email) => {
  const resImage = await uploadImage(photoURL);

  const res = auth()
    .currentUser.updateProfile({
      displayName: name,
      photoURL: resImage === false ? '' : resImage,
    })
    .then(() => true)
    .catch(() => false);
  const changeEmail = auth()
    .currentUser.updateEmail(email)
    .then(() => true)
    .catch(err => {
      console.log(err);
      return false;
    });
  if (res && changeEmail) {
    return firestore()
      .collection('users')
      .doc(currentUser().uid)
      .update({
        name: name,
        phone: phone,
      })
      .then(() => true)
      .catch(() => false);
  }
};
export const getProfile = async () => {
  const res = auth().currentUser.providerData[0];
  const resultPhone = await firestore()
    .collection('users')
    .doc(currentUser().uid)
    .get()
    .then(res => {
      return res.data().phone;
    })
    .catch(err => {
      console.log(err);
    });

  res.phoneNumber = resultPhone;
  return res;
};
const uploadImage = async (uri, mime = 'image/jpg') => {
  const d = storage().ref(`images/${currentUser().uid}`);
  const resDel = d
    .delete()
    .then(() => true)
    .catch(() => false);
  if (resDel === false) {
    return false;
  }
  const refrence = storage().ref(`images/${currentUser().uid}/${Date.now()}`);
  const response = await refrence
    .putFile(uri, {contentType: mime})
    .then(res => {
      return storage().ref(res.metadata.fullPath).getDownloadURL();
    })
    .catch(err => {
      console.log(err);
    });
  return response;
};

export const getArticle = async () => {
  return firestore()
    .collection('article')
    .get()
    .then(res => {
      const data = res.docs.map(doc => doc.data());
      return data;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

// export const postFood = () => {
//   for (const key in food) {
//     firestore().collection('typicalfood').add(food[key]);
//   }
// };
export const getFood = async () => {
  const temp = await firestore()
    .collection('typicalfood')
    .get()
    .then(res => {
      const data = res.docs.map(doc => doc.data());
      return data;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
  temp.sort(function (a, b) {
    if (a['NAMA MAKANAN'] < b['NAMA MAKANAN']) {
      return -1;
    }
    if (a['NAMA MAKANAN'] > b['NAMA MAKANAN']) {
      return 1;
    }
    return 0;
  });
  return temp;
};

export const createData = () => {
  for (const key in datamakanan) {
    firestore()
      .collection('restaurant')
      .add({
        nama_restoran: datamakanan[key]['Nama Restoran'],
        alamat: datamakanan[key].Alamat,
        latitude: Number(datamakanan[key].Latitude),
        longitude: Number(datamakanan[key].Longitude),
        jam_operasional: datamakanan[key]['Jam Operasional'],
        rata_rata_harga_string: datamakanan[key]['Rata-Rata Harga'],
        rata_rata_harga_number: Number(
          datamakanan[key]['Rata-Rata Harga']
            .replace('Rp', '')
            .replace(/,/g, '')
            .replace(/./g, ''),
        ),
        fasilitas: datamakanan[key]['Fasilitas'],
        jumlah_ulasan: datamakanan[key]['Jumlah Ulasan'],
        score_fasilitas: Number(datamakanan[key].score_fasilitas),
        score_harga: Number(datamakanan[key].score_harga),
        score_jam: Number(datamakanan[key].score_jam),
        fasilitas_detail: datamakanan[key].fasilitas_detail,
        thumbnail: datamakanan[key].thumbnail,
        image: [
          datamakanan[key]['menu 1'],
          datamakanan[key]['menu 2'],
          datamakanan[key]['menu 3'],
        ],
        geohash: geohashForLocation([
          Number(datamakanan[key].Latitude),
          Number(datamakanan[key].Longitude),
        ]),
      })
      .then(res => res)
      .catch(err => err);
  }
};

export const calculateScore = async data => {
  console.log(data, 'data');
  const center = [data.lat, data.long];
  const radiusInM10 = 10 * 1000;
  const radiusInM20 = 20 * 1000;
  const bounds = geohashQueryBounds(center, radiusInM20);
  const promises = [];

  for (const b of bounds) {
    const q = firestore()
      .collection('restaurant')
      .orderBy('geohash')
      .startAt(b[0])
      .endAt(b[1])
      .get();

    promises.push(q);
  }
  const temp = await Promise.all(promises).then(snapshots => {
    const matchingDocs = [];
    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const lat = doc.get('latitude');
        const lng = doc.get('longitude');
        const distanceInKm = distanceBetween([lat, lng], center);
        const distanceInM = distanceInKm * 1000;
        if (distanceInM <= radiusInM20 && distanceInM >= radiusInM10) {
          matchingDocs.push({...doc.data(), score_jarak: 3, id: doc.id});
        }
        if (distanceInM >= radiusInM20) {
          matchingDocs.push({...doc.data(), score_jarak: 1, id: doc.id});
        }
        if (distanceInM < radiusInM10) {
          matchingDocs.push({...doc.data(), score_jarak: 5, id: doc.id});
        }
      }
    }
    return matchingDocs;
  });
  for (const key in temp) {
    const test = await getCommentResto(temp[key].id);
    temp[key].comment = test;
  }

  for (const key in temp) {
    if (
      typeof temp[key].comment !== 'undefined' &&
      temp[key].comment.length > 0
    ) {
      let rate = 0;
      for (const kay in temp[key].comment) {
        const test = await getDataFromRef(temp[key].comment[kay].ref);
        rate += test.item.rating;
      }
      temp[key].rate = rate / temp[key].comment.length;
    } else {
      temp[key].rate = 0;
    }
  }

  const temps = [];
  for (const key in temp) {
    let score = {
      ...temp[key],
      range_calculated: Math.pow((temp[key].score_jarak / 5) * 5 - 5, 2),
      price_calculate: Math.pow((temp[key].score_harga / 5) * 5 - 5, 2),
      time_calculate: Math.pow((temp[key].score_jam / 5) * 3 - 3, 3),
      fasilitas_calculate: Math.pow((temp[key].score_fasilitas / 5) * 4 - 4, 2),
    };
    let score_negatif = {
      range_calculated: Math.pow((temp[key].score_jarak / 5) * 5 - 1, 2),
      price_calculate: Math.pow((temp[key].score_harga / 5) * 5 - 1, 2),
      time_calculate: Math.pow((temp[key].score_jam / 5) * 3 - 0.6, 2),
      fasilitas_calculate: Math.pow(
        (temp[key].score_fasilitas / 5) * 4 - 0.8,
        2,
      ),
    };
    const total = Math.sqrt(
      score.price_calculate +
        score.time_calculate +
        score.fasilitas_calculate +
        score.range_calculated,
    );
    const total_negatif = Math.sqrt(
      score_negatif.price_calculate +
        score_negatif.time_calculate +
        score_negatif.fasilitas_calculate +
        score_negatif.range_calculated,
    );
    score.result_positif = total;
    score.result_negatif = total_negatif;
    score.total = total_negatif / (total_negatif + total);

    temps.push(score);
  }
  const sorter = temps.sort((a, b) => b.total - a.total);
  return sorter;
};

export const findDocRestobyId = async id => {
  const temp = await getCommentResto(id);

  let rate = 0;
  for (const kay in temp) {
    const test = await getDataFromRef(temp[kay].ref);
    rate += test.item.rating;
  }
  rate = rate / temp.length;
  return rate;
};
