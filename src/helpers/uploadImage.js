import { getAuth, updateProfile } from '@firebase/auth';
import { doc, setDoc } from '@firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from '@firebase/storage';
import { db } from '../firebase/firebase';

export function uploadImage(image, storageLocation, dbLocation) {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, storageLocation);

    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      () => {},
      (error) => {
        console.log('IMAGE UPLOAD FAILED');
        console.log(`error`, error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then(async (downloadURL) => {
            await setDoc(
              doc(db, dbLocation),
              { imageURL: downloadURL },
              { merge: true },
            );

            console.log(`downloadURL`, downloadURL);

            await updateProfile(getAuth().currentUser, {
              photoURL: downloadURL,
            });
          })
          .catch((error) => {
            console.log(`error`, error);
          });
      },
    );
  } catch (error) {
    console.log(`error`, error);
  }
}

export function deleteImage(storageLocation, dbLocation) {
  const storage = getStorage();
  const avatarRef = ref(storage, storageLocation);
  deleteObject(avatarRef)
    .then(async () => {
      await setDoc(doc(db, dbLocation), { imageURL: '' }, { merge: true });
    })
    .catch((err) => {
      console.log(err);
    });
}
