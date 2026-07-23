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

export interface CloudKnowledgeItemData {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  tags: string[];
  author?: string;
  projectId?: string | null;
  isArchived?: boolean;
  isDeleted?: boolean;
  schemaVersion: number;
  createdAt?: unknown;
  updatedAt?: unknown;
  deletedAt?: unknown;
}

export async function createKnowledgeItem(
  userId: string,
  item: Partial<CloudKnowledgeItemData>
): Promise<string> {
  if (!db || !userId) throw new Error("Firestore instance or userId missing");
  const itemId = item.id || `kb-art-${Date.now()}`;
  const path = `users/${userId}/knowledgeItems/${itemId}`;
  try {
    const docRef = doc(db, 'users', userId, 'knowledgeItems', itemId);
    const payload: CloudKnowledgeItemData = {
      id: itemId,
      title: item.title || 'Uusi Tietopiiri-Artikkeli',
      category: item.category || 'Projects',
      summary: item.summary || '',
      content: item.content || '',
      tags: item.tags || ['KnowledgeBase'],
      author: item.author || 'Jani-Petteri Qvick',
      projectId: item.projectId || null,
      isArchived: false,
      isDeleted: false,
      schemaVersion: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(docRef, payload, { merge: true });
    return itemId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateKnowledgeItem(
  userId: string,
  itemId: string,
  updates: Partial<CloudKnowledgeItemData>
): Promise<void> {
  if (!db || !userId || !itemId) return;
  const path = `users/${userId}/knowledgeItems/${itemId}`;
  try {
    const docRef = doc(db, 'users', userId, 'knowledgeItems', itemId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function archiveKnowledgeItem(userId: string, itemId: string): Promise<void> {
  return updateKnowledgeItem(userId, itemId, { isArchived: true });
}

export async function restoreKnowledgeItem(userId: string, itemId: string): Promise<void> {
  return updateKnowledgeItem(userId, itemId, { isArchived: false, isDeleted: false });
}

export async function softDeleteKnowledgeItem(userId: string, itemId: string): Promise<void> {
  return updateKnowledgeItem(userId, itemId, { isDeleted: true, deletedAt: serverTimestamp() });
}

export async function deleteKnowledgeItem(userId: string, itemId: string): Promise<void> {
  if (!db || !userId || !itemId) return;
  const path = `users/${userId}/knowledgeItems/${itemId}`;
  try {
    const docRef = doc(db, 'users', userId, 'knowledgeItems', itemId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeKnowledgeItems(
  userId: string,
  callback: (items: CloudKnowledgeItemData[]) => void,
  onError?: (err: unknown) => void
): () => void {
  if (!db || !userId) {
    callback([]);
    return () => {};
  }
  const path = `users/${userId}/knowledgeItems`;
  try {
    const colRef = collection(db, 'users', userId, 'knowledgeItems');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: CloudKnowledgeItemData[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as CloudKnowledgeItemData);
        });
        callback(list);
      },
      (error) => {
        console.warn("Firestore knowledgeItems listener warning:", error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
