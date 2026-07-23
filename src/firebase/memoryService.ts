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

export interface CloudMemoryData {
  id: string;
  memoryType: string; // 'Observation' | 'Reflection' | 'Idea' | 'Milestone' | 'Insight' | 'Fact'
  title: string;
  content: string;
  summary: string;
  importance: number; // 1-5 or 0-1 scale
  confidence: number; // 0-1 scale
  sourceType: string; // 'user_input' | 'system_observation' | 'journal' | 'chat'
  sourceId?: string | null;
  relatedProjectIds?: string[];
  relatedConversationId?: string | null;
  tags: string[];
  occurredAt: string; // ISO date string
  isPinned: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  embeddingStatus: string; // 'pending' | 'completed' | 'none' | 'failed'
  embeddingModel?: string;
  embeddingModelVersion?: string;
  schemaVersion: number;
  createdAt?: unknown;
  updatedAt?: unknown;
  deletedAt?: unknown;
}

export async function createMemory(
  userId: string,
  memory: Partial<CloudMemoryData>
): Promise<string> {
  if (!db || !userId) throw new Error("Firestore instance or userId missing");
  const memoryId = memory.id || `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const path = `users/${userId}/memories/${memoryId}`;
  try {
    const docRef = doc(db, 'users', userId, 'memories', memoryId);
    const payload: CloudMemoryData = {
      id: memoryId,
      memoryType: memory.memoryType || 'Observation',
      title: memory.title || 'Uusi muisto',
      content: memory.content || '',
      summary: memory.summary || '',
      importance: memory.importance ?? 3,
      confidence: memory.confidence ?? 1.0,
      sourceType: memory.sourceType || 'user_input',
      sourceId: memory.sourceId || null,
      relatedProjectIds: memory.relatedProjectIds || [],
      relatedConversationId: memory.relatedConversationId || null,
      tags: memory.tags || ['General'],
      occurredAt: memory.occurredAt || new Date().toISOString(),
      isPinned: memory.isPinned ?? false,
      isArchived: memory.isArchived ?? false,
      isDeleted: memory.isDeleted ?? false,
      embeddingStatus: memory.embeddingStatus || 'none',
      embeddingModel: memory.embeddingModel || 'none',
      embeddingModelVersion: memory.embeddingModelVersion || '1.0',
      schemaVersion: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(docRef, payload, { merge: true });
    return memoryId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateMemory(
  userId: string,
  memoryId: string,
  updates: Partial<CloudMemoryData>
): Promise<void> {
  if (!db || !userId || !memoryId) return;
  const path = `users/${userId}/memories/${memoryId}`;
  try {
    const docRef = doc(db, 'users', userId, 'memories', memoryId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function archiveMemory(userId: string, memoryId: string): Promise<void> {
  return updateMemory(userId, memoryId, { isArchived: true });
}

export async function restoreMemory(userId: string, memoryId: string): Promise<void> {
  return updateMemory(userId, memoryId, { isArchived: false, isDeleted: false });
}

export async function softDeleteMemory(userId: string, memoryId: string): Promise<void> {
  return updateMemory(userId, memoryId, { isDeleted: true, deletedAt: serverTimestamp() });
}

export async function deleteMemory(userId: string, memoryId: string): Promise<void> {
  if (!db || !userId || !memoryId) return;
  const path = `users/${userId}/memories/${memoryId}`;
  try {
    const docRef = doc(doc(db, 'users', userId), 'memories', memoryId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeMemories(
  userId: string,
  callback: (memories: CloudMemoryData[]) => void,
  onError?: (err: unknown) => void
): () => void {
  if (!db || !userId) {
    callback([]);
    return () => {};
  }
  const path = `users/${userId}/memories`;
  try {
    const colRef = collection(db, 'users', userId, 'memories');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: CloudMemoryData[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as CloudMemoryData);
        });
        callback(list);
      },
      (error) => {
        console.warn("Firestore memories listener warning:", error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
