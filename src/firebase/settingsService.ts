import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { handleFirestoreError, OperationType } from './firestoreError';

export interface CloudUserSettingsData {
  settingId: string; // e.g. "app_settings"
  soundEnabled?: boolean;
  ambientSound?: string;
  voiceVolume?: number;
  preferredVoiceName?: string;
  voiceRate?: number;
  voicePitch?: number;
  layoutMode?: string;
  theme?: string;
  schemaVersion: number;
  updatedAt?: unknown;
}

export async function updateUserSettings(
  userId: string,
  settingId: string = 'app_settings',
  settings: Partial<CloudUserSettingsData>
): Promise<void> {
  if (!db || !userId) return;
  const path = `users/${userId}/settings/${settingId}`;
  try {
    const docRef = doc(db, 'users', userId, 'settings', settingId);
    const payload: Partial<CloudUserSettingsData> = {
      settingId,
      ...settings,
      schemaVersion: 1,
      updatedAt: serverTimestamp(),
    };
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserSettings(
  userId: string,
  settingId: string = 'app_settings'
): Promise<CloudUserSettingsData | null> {
  if (!db || !userId) return null;
  const path = `users/${userId}/settings/${settingId}`;
  try {
    const docRef = doc(db, 'users', userId, 'settings', settingId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as CloudUserSettingsData;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export function subscribeUserSettings(
  userId: string,
  settingId: string = 'app_settings',
  callback: (settings: CloudUserSettingsData | null) => void,
  onError?: (err: unknown) => void
): () => void {
  if (!db || !userId) {
    callback(null);
    return () => {};
  }
  const path = `users/${userId}/settings/${settingId}`;
  try {
    const docRef = doc(db, 'users', userId, 'settings', settingId);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data() as CloudUserSettingsData);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.warn("Firestore user settings listener warning:", error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}
