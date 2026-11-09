import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../data/data.js';

const productsCollection = collection(db, 'products');

export async function getProductById(id) {
  const productSnapshot = await getDoc(doc(productsCollection, id));

  if (!productSnapshot.exists()) {
    return null;
  }

  return { id: productSnapshot.id, ...productSnapshot.data() };
}

export async function getAllProducts() {
  const querySnapshot = await getDocs(productsCollection);
  return querySnapshot.docs.map((productSnapshot) => ({
    id: productSnapshot.id,
    ...productSnapshot.data(),
  }));
}

export async function saveProduct(product) {
  const productReference = await addDoc(productsCollection, product);
  return { id: productReference.id, ...product };
}

export async function updateProduct(id, product) {
  const productReference = doc(productsCollection, id);
  const productSnapshot = await getDoc(productReference);

  if (!productSnapshot.exists()) {
    return null;
  }

  await updateDoc(productReference, product);
  return { id, ...productSnapshot.data(), ...product };
}

export async function deleteProduct(id) {
  await deleteDoc(doc(productsCollection, id));
}
