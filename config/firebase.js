import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNWSir9GQx-hlhTFmWj1-TdA_xmZS0_Nc",
  authDomain: "expo-assignment-255e8.firebaseapp.com",
  projectId: "expo-assignment-255e8",
  storageBucket: "expo-assignment-255e8.firebasestorage.app",
  messagingSenderId: "804607311060",
  appId: "1:804607311060:web:8c46d947fe2ab5867f0f41",
  measurementId: "G-4V4EE5894N",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();


let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}


let firestore;
try {
  firestore = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
} catch {
  firestore = getFirestore(app);
}

export { auth, firestore };