import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  Timestamp,
  doc,
  updateDoc,
  increment,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';

export interface UserQuestion {
  id?: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  question: string;
  response: string;
  timestamp: Timestamp;
  category: 'roasts' | 'puns' | 'riddles' | 'stories';
  prompt?: string;
  isRandom?: boolean;
  wordCount?: number;
  responseTime?: number;
}

export interface UserStats {
  id?: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  totalGenerations: number;
  roastsGenerated: number;
  punsGenerated: number;
  riddlesGenerated: number;
  storiesGenerated: number;
  totalWordsGenerated: number;
  averageResponseTime: number;
  lastActive: Timestamp;
  createdAt: Timestamp;
}

export const saveUserQuestion = async (question: Omit<UserQuestion, 'id' | 'timestamp'>) => {
  try {
    const startTime = Date.now();
    
    // Save the question
    const docRef = await addDoc(collection(db, 'userQuestions'), {
      ...question,
      timestamp: Timestamp.now(),
      responseTime: 0 // Will be updated after response
    });

    // Update user stats
    await updateUserStats(
      question.userId, 
      question.category, 
      question.response?.length || 0, 
      Date.now() - startTime,
      question.userName,
      question.userEmail
    );

    return docRef.id;
  } catch (error) {
    console.error('Error saving question:', error);
    throw error;
  }
};

export const updateUserStats = async (userId: string, category: string, wordCount: number, responseTime: number, userName?: string, userEmail?: string) => {
  try {
    const statsRef = doc(db, 'userStats', userId);
    const statsDoc = await getDoc(statsRef);

    if (statsDoc.exists()) {
      // Update existing stats
      const updateData: any = {
        totalGenerations: increment(1),
        [`${category}Generated`]: increment(1),
        totalWordsGenerated: increment(wordCount),
        averageResponseTime: increment(responseTime),
        lastActive: Timestamp.now()
      };

      // Add user info if provided and not already set
      if (userName && !statsDoc.data().userName) {
        updateData.userName = userName;
      }
      if (userEmail && !statsDoc.data().userEmail) {
        updateData.userEmail = userEmail;
      }

      await updateDoc(statsRef, updateData);
    } else {
      // Create new stats document
      await addDoc(collection(db, 'userStats'), {
        userId,
        userName: userName || '',
        userEmail: userEmail || '',
        totalGenerations: 1,
        roastsGenerated: category === 'roasts' ? 1 : 0,
        punsGenerated: category === 'puns' ? 1 : 0,
        riddlesGenerated: category === 'riddles' ? 1 : 0,
        storiesGenerated: category === 'stories' ? 1 : 0,
        totalWordsGenerated: wordCount,
        averageResponseTime: responseTime,
        lastActive: Timestamp.now(),
        createdAt: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
};

export const getUserQuestions = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'userQuestions'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as UserQuestion[];
  } catch (error) {
    console.error('Error getting user questions:', error);
    throw error;
  }
};

export const getUserStats = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'userStats'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    return {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data()
    } as UserStats;
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
};

export const getAllUserStats = async () => {
  try {
    const q = query(
      collection(db, 'userStats'),
      orderBy('totalGenerations', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as UserStats[];
  } catch (error) {
    console.error('Error getting all user stats:', error);
    throw error;
  }
};

export const getCategoryStats = async (category: string) => {
  try {
    const q = query(
      collection(db, 'userQuestions'),
      where('category', '==', category),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as UserQuestion[];
  } catch (error) {
    console.error('Error getting category stats:', error);
    throw error;
  }
};
