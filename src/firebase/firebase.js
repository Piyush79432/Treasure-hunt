import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFmpuMxSN4kqjucDuKDYm_LLiirFiEfSI",
  authDomain: "treasure-hunt-78d9d.firebaseapp.com",
  projectId: "treasure-hunt-78d9d",
  storageBucket: "treasure-hunt-78d9d.firebasestorage.app",
  messagingSenderId: "933274450705",
  appId: "1:933274450705:web:002f3f35a4e64b81d0eab0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName });
    
    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email,
      displayName,
      walletAddress: "",
      gameStats: {
        gamesPlayed: 0,
        treasuresFound: 0,
        lastPlayed: null
      },
      createdAt: new Date()
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// User data functions
export const updateUserWallet = async (userId, walletAddress) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { walletAddress });
  } catch (error) {
    throw error;
  }
};

export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw error;
  }
};

export const updateGameStats = async (userId, stats) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const updatedStats = {
        ...userData.gameStats,
        ...stats,
        lastPlayed: new Date()
      };
      
      await updateDoc(userRef, { gameStats: updatedStats });
    }
  } catch (error) {
    throw error;
  }
};

export { auth, db };
