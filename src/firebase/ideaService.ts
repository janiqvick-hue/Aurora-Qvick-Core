import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { handleFirestoreError, OperationType } from './firestoreError';

export interface CloudIdeaItemData {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  status: string; // 'Draft' | 'In Evaluation' | 'Approved' | 'Rejected' | 'Archived'
  impact: string; // 'High' | 'Medium' | 'Low'
  projectId?: string | null;
  isArchived?: boolean;
  isDeleted?: boolean;
  schemaVersion: number;
  createdAt?: unknown;
  updatedAt?: unknown;
  deletedAt?: unknown;
}

export async function createIdeaItem(
  userId: string,
  idea: Partial<CloudIdeaItemData>
): Promise<string> {
  if (!db || !userId) throw new Error("Firestore instance or userId missing");
  const ideaId = idea.id || `idea-${Date.now()}`;
  const path = `users/${userId}/ideaVault/${ideaId}`;
  try {
    const docRef = doc(db, 'users', userId, 'ideaVault', ideaId);
    const payload: CloudIdeaItemData = {
      id: ideaId,
      title: idea.title || 'Uusi Idea',
      category: idea.category || 'Game Ideas',
      description: idea.description || '',
      tags: idea.tags || ['#GameIdea'],
      status: idea.status || 'Draft',
      impact: idea.impact || 'Medium',
      projectId: idea.projectId || null,
      isArchived: false,
      isDeleted: false,
      schemaVersion: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(docRef, payload, { merge: true });
    return ideaId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateIdeaItem(
  userId: string,
  ideaId: string,
  updates: Partial<CloudIdeaItemData>
): Promise<void> {
  if (!db || !userId || !ideaId) return;
  const path = `users/${userId}/ideaVault/${ideaId}`;
  try {
    const docRef = doc(db, 'users', userId, 'ideaVault', ideaId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function updateIdeaStatus(
  userId: string,
  ideaId: string,
  status: string
): Promise<void> {
  return updateIdeaItem(userId, ideaId, { status });
}

export async function archiveIdeaItem(userId: string, ideaId: string): Promise<void> {
  return updateIdeaItem(userId, ideaId, { isArchived: true, status: 'Archived' });
}

export async function restoreIdeaItem(userId: string, ideaId: string): Promise<void> {
  return updateIdeaItem(userId, ideaId, { isArchived: false, isDeleted: false, status: 'Draft' });
}

export async function softDeleteIdeaItem(userId: string, ideaId: string): Promise<void> {
  return updateIdeaItem(userId, ideaId, { isDeleted: true, deletedAt: serverTimestamp() });
}

export async function deleteIdeaItem(userId: string, ideaId: string): Promise<void> {
  if (!db || !userId || !ideaId) return;
  const path = `users/${userId}/ideaVault/${ideaId}`;
  try {
    const docRef = doc(db, 'users', userId, 'ideaVault', ideaId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeIdeaItems(
  userId: string,
  callback: (ideas: CloudIdeaItemData[]) => void,
  onError?: (err: unknown) => void
): () => void {
  if (!db || !userId) {
    callback([]);
    return () => {};
  }
  const path = `users/${userId}/ideaVault`;
  try {
    const colRef = collection(db, 'users', userId, 'ideaVault');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: CloudIdeaItemData[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as CloudIdeaItemData);
        });
        callback(list);
      },
      (error) => {
        console.warn("Firestore ideaVault listener warning:", error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
