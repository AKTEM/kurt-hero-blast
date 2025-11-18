import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, where } from "firebase/firestore";
import app from "./firebase";

const db = getFirestore(app);
const productsCollection = collection(db, "products");

export interface Product {
  id?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  colors?: string[];
  shades?: string[];
  lengths?: string[];
  inStock: boolean;
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const addProduct = async (product: Omit<Product, "id">): Promise<string> => {
  const docRef = await addDoc(productsCollection, {
    ...product,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<void> => {
  const productRef = doc(db, "products", id);
  await updateDoc(productRef, {
    ...product,
    updatedAt: new Date(),
  });
};

export const deleteProduct = async (id: string): Promise<void> => {
  const productRef = doc(db, "products", id);
  await deleteDoc(productRef);
};

export const getProduct = async (id: string): Promise<Product | null> => {
  const productRef = doc(db, "products", id);
  const productDoc = await getDoc(productRef);
  
  if (productDoc.exists()) {
    return { id: productDoc.id, ...productDoc.data() } as Product;
  }
  return null;
};

export const getAllProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(productsCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const q = query(productsCollection, where("category", "==", category));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const q = query(productsCollection, where("featured", "==", true));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};
