import { auth } from "./firebaseConfig";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut, 
  UserCredential 
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export async function signInWithGoogle(): Promise<UserCredential> {
  if (!auth) {
    throw new Error("Firebase Authentication ei ole alustettu. Tarkista VITE_FIREBASE_* ymparistomuuttujat.");
  }
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error: unknown) {
    console.error("Google Sign-In epäonnistui:", error);
    throw error;
  }
}

export async function signOut(): Promise<void> {
  if (!auth) {
    throw new Error("Firebase Authentication ei ole alustettu.");
  }
  try {
    await firebaseSignOut(auth);
  } catch (error: unknown) {
    console.error("Uloskirjautuminen epäonnistui:", error);
    throw error;
  }
}
