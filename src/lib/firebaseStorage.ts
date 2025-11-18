import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import app from "./firebase";

const storage = getStorage(app);

export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
  const timestamp = Date.now();
  const storageRef = ref(storage, `products/${productId}/${timestamp}-${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
