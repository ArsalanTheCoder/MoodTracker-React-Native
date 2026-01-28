import { db } from '../config/firebaseConfig';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc,       
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

const MOOD_COLLECTION = collection(db, 'moods');

// 1. ADD MOOD
export const addMoodEntry = async (moodData) => {
  try {
    await addDoc(MOOD_COLLECTION, {
      ...moodData,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// 2. FETCH MOODS 
export const subscribeToMoods = (callback) => {
  const q = query(MOOD_COLLECTION, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const moodList = snapshot.docs.map((doc) => {
      const data = doc.data();
      
      const rawDate = data.createdAt ? data.createdAt.toDate() : new Date();

      return {
        id: doc.id,
        ...data,
        fullDate: rawDate, 
        dateString: rawDate.toLocaleDateString(),
        timeString: rawDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      };
    });
    
    callback(moodList);
  });

  return unsubscribe;
};

// 3. DELETE: Remove a mood by ID
export const deleteMoodEntry = async (moodId) => {
  try {
    const moodRef = doc(db, 'moods', moodId);
    await deleteDoc(moodRef);
    console.log("Mood deleted successfully!");
  } catch (error) {
    console.error("Error deleting mood: ", error);
    throw error;
  }
};