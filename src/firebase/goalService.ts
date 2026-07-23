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

export interface CloudGoalData {
  id: string;
  title: string;
  description?: string;
  projectId?: string | null;
  progress: number; // 0-100
  targetValue?: number;
  currentValue?: number;
  status?: string; // 'active' | 'completed' | 'archived'
  isArchived?: boolean;
  isDeleted?: boolean;
  schemaVersion: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export async function createGoal(userId: string, goal: Partial<CloudGoalData>): Promise<string> {
  if (!db || !userId) throw new Error("Firestore instance or userId missing");
  const goalId = goal.id || `goal-${Date.now()}`;
  const path = `users/${userId}/goals/${goalId}`;
  try {
    const docRef = doc(db, 'users', userId, 'goals', goalId);
    const payload: CloudGoalData = {
      id: goalId,
      title: goal.title || 'Uusi Tavoite',
      description: goal.description || '',
      projectId: goal.projectId || null,
      progress: goal.progress ?? 0,
      targetValue: goal.targetValue ?? 100,
      currentValue: goal.currentValue ?? 0,
      status: goal.status || 'active',
      isArchived: false,
      isDeleted: false,
      schemaVersion: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(docRef, payload, { merge: true });
    return goalId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateGoal(userId: string, goalId: string, updates: Partial<CloudGoalData>): Promise<void> {
  if (!db || !userId || !goalId) return;
  const path = `users/${userId}/goals/${goalId}`;
  try {
    const docRef = doc(db, 'users', userId, 'goals', goalId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function updateGoalProgress(userId: string, goalId: string, progress: number, currentValue?: number): Promise<void> {
  const isCompleted = progress >= 100;
  return updateGoal(userId, goalId, {
    progress,
    ...(currentValue !== undefined && { currentValue }),
    status: isCompleted ? 'completed' : 'active',
  });
}

export async function archiveGoal(userId: string, goalId: string): Promise<void> {
  return updateGoal(userId, goalId, { isArchived: true, status: 'archived' });
}

export async function restoreGoal(userId: string, goalId: string): Promise<void> {
  return updateGoal(userId, goalId, { isArchived: false, isDeleted: false, status: 'active' });
}

export async function deleteGoal(userId: string, goalId: string): Promise<void> {
  if (!db || !userId || !goalId) return;
  const path = `users/${userId}/goals/${goalId}`;
  try {
    const docRef = doc(db, 'users', userId, 'goals', goalId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeGoals(
  userId: string,
  callback: (goals: CloudGoalData[]) => void,
  onError?: (err: unknown) => void
): () => void {
  if (!db || !userId) {
    callback([]);
    return () => {};
  }
  const path = `users/${userId}/goals`;
  try {
    const colRef = collection(db, 'users', userId, 'goals');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: CloudGoalData[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as CloudGoalData);
        });
        callback(list);
      },
      (error) => {
        console.warn("Firestore goals listener warning:", error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
