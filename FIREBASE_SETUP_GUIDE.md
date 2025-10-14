# Firebase Setup Guide for Roast Bot

This guide will help you set up Firebase Authentication with Google Sign-In and Firestore to track user questions and create user accounts.

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `roast-bot` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In Firebase Console, go to "Authentication" → "Get started"
2. Click "Sign-in method" tab
3. Enable "Google" provider:
   - Click on Google
   - Toggle "Enable"
   - Add your project support email
   - Click "Save"

## 3. Set up Firestore Database

1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (for development)
3. Select a location (choose closest to your users)
4. Click "Done"

## 4. Install Firebase Dependencies

```bash
npm install firebase
```

## 5. Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" → Web app (</> icon)
4. Register app with nickname: `roast-bot-web`
5. Copy the config object

## 6. Create Firebase Configuration File

Create `lib/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
```

## 7. Create Authentication Context

Create `contexts/AuthContext.tsx`:

```typescript
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
```

## 8. Create User Questions Service

Create `lib/userQuestions.ts`:

```typescript
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface UserQuestion {
  id?: string;
  userId: string;
  question: string;
  response: string;
  timestamp: Timestamp;
  category?: string;
}

export const saveUserQuestion = async (question: UserQuestion) => {
  try {
    const docRef = await addDoc(collection(db, 'userQuestions'), {
      ...question,
      timestamp: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving question:', error);
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
```

## 9. Update Your Layout

Update `app/layout.tsx` to include the AuthProvider:

```typescript
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

## 10. Create Authentication Components

Create `components/AuthButton.tsx`:

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button'; // Assuming you have a button component

export const AuthButton = () => {
  const { user, signInWithGoogle, logout } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span>Welcome, {user.displayName}</span>
        <Button onClick={logout} variant="outline">
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={signInWithGoogle}>
      Sign in with Google
    </Button>
  );
};
```

## 11. Update Your Main Page

Update `app/page.tsx` to use authentication and save questions:

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { saveUserQuestion } from '@/lib/userQuestions';
import { AuthButton } from '@/components/AuthButton';

export default function Home() {
  const { user } = useAuth();

  const handleQuestionSubmit = async (question: string, response: string) => {
    if (user) {
      try {
        await saveUserQuestion({
          userId: user.uid,
          question,
          response,
          timestamp: new Date() as any // Will be converted to Timestamp
        });
        console.log('Question saved successfully');
      } catch (error) {
        console.error('Failed to save question:', error);
      }
    }
  };

  return (
    <div>
      <AuthButton />
      {user ? (
        <div>
          {/* Your existing roast bot interface */}
          <p>User is signed in: {user.email}</p>
        </div>
      ) : (
        <div>
          <p>Please sign in to use the roast bot</p>
        </div>
      )}
    </div>
  );
}
```

## 12. Firestore Security Rules

Update your Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own questions
    match /userQuestions/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 13. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

Update `lib/firebase.ts` to use environment variables:

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
```

## 14. Testing

1. Start your development server: `npm run dev`
2. Navigate to your app
3. Click "Sign in with Google"
4. Complete the OAuth flow
5. Test saving questions to Firestore
6. Check Firebase Console to see the data

## 15. Production Considerations

1. **Security Rules**: Update Firestore rules for production
2. **Domain Configuration**: Add your production domain to Firebase Auth settings
3. **Environment Variables**: Use different Firebase projects for dev/prod
4. **Error Handling**: Implement proper error handling and user feedback
5. **Loading States**: Add loading indicators for auth operations

## Troubleshooting

- **CORS Issues**: Make sure your domain is added to Firebase Auth settings
- **Permission Denied**: Check Firestore security rules
- **Auth State Not Updating**: Ensure AuthProvider wraps your app properly
- **Firebase Config Errors**: Verify environment variables are set correctly

This setup will give you:
- Google Sign-In authentication
- User-specific question tracking
- Secure data storage in Firestore
- Real-time authentication state management
