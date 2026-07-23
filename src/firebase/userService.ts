import { db } from "./firebaseConfig";
import { doc, getDoc, setDoc, serverTimestamp, FieldValue } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: FieldValue;
  updatedAt: FieldValue;
  lastLoginAt: FieldValue;
  schemaVersion: number;
}

/**
 * Bootstraps the authenticated user in Cloud Firestore under /users/{userId}.
 * Ensures that the user document exists without overwriting 'createdAt' on subsequent logins.
 */
export async function bootstrapUser(user: {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}): Promise<void> {
  if (!db) {
    throw new Error("Cloud Firestore ei ole alustettu. Tarkista Firebase-määritykset.");
  }

  const userRef = doc(db, "users", user.uid);

  try {
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // First-time user creation
      const newProfile: UserProfile = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        schemaVersion: 1,
      };
      await setDoc(userRef, newProfile);
    } else {
      // Existing user: Update metadata without overwriting createdAt
      await setDoc(
        userRef,
        {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  } catch (error) {
    console.error("Virhe käyttäjäproseduurissa (Firestore bootstrapUser):", error);
    throw error;
  }
}
