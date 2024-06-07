// /api/firebaseService.ts
import { collection, getDocs, addDoc, query, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from './firebaseConfig';

export interface StepData {
  title: string;
  imagePath: string;
  answers: number[];
  rows: number;
  cols: number;
  minorId: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'major' | 'mid' | 'minor';
  parentId?: string;
}

const fetchCategories = async (type: 'major' | 'mid' | 'minor', parentId?: string): Promise<Category[]> => {
  console.log(`Fetching ${type} categories from Firestore...`);
  let q = query(collection(db, 'categories'), where('type', '==', type));
  if (parentId) {
    q = query(q, where('parentId', '==', parentId));
  }
  const querySnapshot = await getDocs(q);
  const categories: Category[] = [];
  querySnapshot.forEach((doc) => {
    categories.push({ id: doc.id, ...doc.data() } as Category);
  });
  console.log(`Fetched ${type} categories:`, categories);
  return categories;
};

const fetchSteps = async (minorId: string): Promise<StepData[]> => {
  console.log('Fetching steps from Firestore...');
  const q = query(collection(db, 'steps'), where('minorId', '==', minorId));
  const querySnapshot = await getDocs(q);
  const stepsData: StepData[] = [];
  querySnapshot.forEach((doc) => {
    stepsData.push(doc.data() as StepData);
  });
  console.log('Fetched steps:', stepsData);
  return stepsData;
};

const uploadImage = async (file: File): Promise<string> => {
  console.log('Uploading image:', file.name);
  const storageRef = ref(storage, `images/${file.name}`);
  const uploadTask = await uploadBytesResumable(storageRef, file);
  const downloadURL = await getDownloadURL(uploadTask.ref);
  console.log('Uploaded image URL:', downloadURL);
  return downloadURL;
};

const addStep = async (stepData: StepData) => {
  console.log('Adding new step to Firestore:', stepData);
  const stepDocRef = await addDoc(collection(db, 'steps'), stepData);
  const minorDocRef = doc(db, 'categories', stepData.minorId);
  await updateDoc(minorDocRef, {
    steps: arrayUnion(stepDocRef.id)
  });
  console.log('Step added successfully');
};

const addCategory = async (category: Omit<Category, 'id'>): Promise<string> => {
  console.log('Adding new category to Firestore:', category);
  const categoryDocRef = await addDoc(collection(db, 'categories'), category);
  console.log('Category added successfully with ID:', categoryDocRef.id);
  return categoryDocRef.id;
};

export { fetchSteps, uploadImage, addStep, fetchCategories, addCategory };
