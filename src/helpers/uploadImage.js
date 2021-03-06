import { doc, setDoc, getDoc } from '@firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from '@firebase/storage';
import { db } from '../firebase/firebase';

export function uploadImage(image, storageLocation, dbLocation) {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, storageLocation);

    uploadString(storageRef, image.split(',')[1], 'base64', {
      contentType: 'image/png',
    }).then(() => {
      getDownloadURL(ref(storage, storageLocation)).then(
        async (downloadURL) => {
          await setDoc(
            doc(db, dbLocation),
            { imageURL: downloadURL },
            { merge: true },
          );
        },
      );
    });
  } catch (e) {}
}

export async function deleteImage(storageLocation, dbLocation) {
  const storage = getStorage();
  const avatarRef = ref(storage, storageLocation);

  const document = await getDoc(doc(db, dbLocation));
  if (document.exists()) return;

  // verify that the image exists
  getDownloadURL(avatarRef).then(async (url) => {
    if (!url) return;
    await deleteObject(avatarRef);
    await setDoc(doc(db, dbLocation), { imageURL: '' }, { merge: true });
  });
}
