import app from '../';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

const db = getFirestore(app);

export async function addData<T>(colllection: string, id: string, data: T) {
  let result = null;
  let error = null;
  try {
    result = await setDoc(doc(db, colllection, id), data as any, {
      merge: true,
    });
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export async function updateData<T>(collection: string, id: string, data: T) {
  let result = null;
  let error = null;
  try {
    result = await updateDoc(doc(db, collection, id), data as any, {
      merge: true,
    });
  } catch (e) {
    error = e;
  }
  return { result, error };
}

export async function getDocument<T>(collection: string, id: string) {
  let docRef = doc(db, collection, id);

  let result = null;
  let error = null;

  try {
    result = await getDoc(docRef);
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export async function removeData(collection: string, id: string) {
  let result = null;
  let error = null;
  try {
    result = await deleteDoc(doc(db, collection, id));
  } catch (e) {
    error = e;
  }
  return { result, error };
}
