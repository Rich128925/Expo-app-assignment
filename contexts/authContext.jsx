import { auth, firestore } from "@/config/firebase";
import * as SplashScreen from "expo-splash-screen";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";


SplashScreen.preventAutoHideAsync();

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const initializingRef = useRef(true); 

  // ── Create / update user document in Firestore ────────────
  const createUserDocument = async (uid, email, name) => {
    try {
      const ref = doc(firestore, "users", uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          uid,
          email,
          name: name || email?.split("@")[0] || "User",
          image: null,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        });
      } else {
        await updateDoc(ref, { lastLogin: new Date().toISOString() });
      }
      return true;
    } catch (error) {
      console.log("⚠️  createUserDocument:", error?.message);
      return false;
    }
  };

  // ── Fetch user profile from Firestore ─────────────────────
  const getUserData = async (uid) => {
    try {
      const snap = await getDoc(doc(firestore, "users", uid));
      if (snap.exists()) {
        const d = snap.data();
        return {
          uid: d?.uid || uid,
          email: d?.email || auth.currentUser?.email,
          name: d?.name || null,
          image: d?.image || null,
        };
      }
      return null;
    } catch (error) {
      console.log("⚠️  getUserData:", error?.message);
      return null;
    }
  };

  
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser && isMounted) {
          console.log("✅ AUTH: Logged in —", firebaseUser.email);

          
          setInitializing(false);
          const profile = await getUserData(firebaseUser.uid);
          const name = profile?.name || firebaseUser.displayName || null;

          setInitializing(false);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name,
            image: firebaseUser.photoURL,
          });

          
          createUserDocument(
            firebaseUser.uid,
            firebaseUser.email || "",
            name,
          ).catch(() => {});
        } else if (isMounted) {
          console.log("🚪 AUTH: Logged out");
          setInitializing(false);
          setUser(null);
        }
      } catch (error) {
        console.log("⚠️  Auth state error:", error?.message);
      } finally {
       
        if (isMounted && initializingRef.current) {
          initializingRef.current = false;
          await SplashScreen.hideAsync();
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // ────────────────────── Login ────────────────────────────
  const login = async (email, password) => {
    console.log("🔐 LOGIN: Attempting —", email);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ LOGIN: Success");
      return { success: true };
    } catch (error) {
      let msg = "Login failed";
      if (error?.code === "auth/invalid-credential")
        msg = "Invalid email or password";
      else if (error?.code === "auth/user-not-found")
        msg = "No account found with this email";
      else if (error?.code === "auth/wrong-password")
        msg = "Incorrect password";
      else if (error?.code === "auth/too-many-requests")
        msg = "Too many attempts. Try again later";
      else if (error?.code === "auth/network-request-failed")
        msg = "Network error. Check your connection";
      console.log("❌ LOGIN ERROR:", error?.code);
      return { success: false, msg };
    }
  };

  // ───────────────────────── Register ──────────────────────
  const register = async (email, password, name) => {
    console.log("📝 REGISTER: Creating account —", email);
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (name) {
        await updateProfile(newUser, { displayName: name });
      }

      console.log("✅ REGISTER: Success");

      // Create Firestore profile and include the registered name
      await createUserDocument(newUser.uid, email, name);

      return { success: true };
    } catch (error) {
      let msg = "Registration failed";
      if (error?.code === "auth/email-already-in-use")
        msg = "Email is already registered";
      else if (error?.code === "auth/invalid-email")
        msg = "Invalid email format";
      else if (error?.code === "auth/weak-password")
        msg = "Password must be at least 6 characters";
      else if (error?.code === "auth/network-request-failed")
        msg = "Network error. Check your connection";
      console.log("❌ REGISTER ERROR:", error?.code);
      return { success: false, msg };
    }
  };

  // ───────────────────────── Logout ────────────────────────
  const logout = async () => {
    try {
      await signOut(auth);
      console.log("✅ LOGOUT: Success");
      return { success: true };
    } catch (error) {
      console.log("❌ LOGOUT ERROR:", error?.message);
      return { success: false, msg: error?.message };
    }
  };

  // ──────────────────── Update user data ───────────────────
  const updateUserData = async (userId) => {
    const data = await getUserData(userId);
    if (data) {
      setUser(data);
      return { success: true };
    }
    return { success: false, msg: "User not found" };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        updateUserData,
        logout,
        initializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
