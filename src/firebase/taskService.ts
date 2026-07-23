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

export interface CloudTaskData {
  id: string;
  title: string;
  description?: string;
  projectId?: string | null;
  status?: string; // 'todo' | 'in_progress' | 'completed'
  priority?: string; // 'low' | 'medium' | 'high' | 'critical'
  dueDate?: string | null;
  isCompleted?: boolean;
  isArchived?: boolean;
  isDeleted?: boolean;
  schemaVersion: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface TaskFilterOptions {
  projectId?: string;
  status?: string;
  includeArchived?: boolean;
}

export async function createTask(userId: string, task: Partial<CloudTaskData>): Promise<string> {
  if (!db || !userId) throw new Error("Firestore instance or userId missing");
  const taskId = task.id || `task-${Date.now()}`;
  const path = `users/${userId}/tasks/${taskId}`;
  try {
    const docRef = doc(db, 'users', userId, 'tasks', taskId);
    const payload: CloudTaskData = {
      id: taskId,
      title: task.title || 'Uusi Tehtävä',
      description: task.description || '',
      projectId: task.projectId || null,
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      dueDate: task.dueDate || null,
      isCompleted: task.isCompleted ?? false,
      isArchived: false,
      isDeleted: false,
      schemaVersion: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(docRef, payload, { merge: true });
    return taskId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateTask(userId: string, taskId: string, updates: Partial<CloudTaskData>): Promise<void> {
  if (!db || !userId || !taskId) return;
  const path = `users/${userId}/tasks/${taskId}`;
  try {
    const docRef = doc(db, 'users', userId, 'tasks', taskId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function archiveTask(userId: string, taskId: string): Promise<void> {
  return updateTask(userId, taskId, { isArchived: true });
}

export async function restoreTask(userId: string, taskId: string): Promise<void> {
  return updateTask(userId, taskId, { isArchived: false, isDeleted: false });
}

export async function deleteTask(userId: string, taskId: string): Promise<void> {
  if (!db || !userId || !taskId) return;
  const path = `users/${userId}/tasks/${taskId}`;
  try {
    const docRef = doc(db, 'users', userId, 'tasks', taskId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeTasks(
  userId: string,
  filterOptions: TaskFilterOptions,
  callback: (tasks: CloudTaskData[]) => void,
  onError?: (err: unknown) => void
): () => void {
  if (!db || !userId) {
    callback([]);
    return () => {};
  }
  const path = `users/${userId}/tasks`;
  try {
    const colRef = collection(db, 'users', userId, 'tasks');
    return onSnapshot(
      colRef,
      (snapshot) => {
        let list: CloudTaskData[] = [];
        snapshot.forEach((docSnap) => {
          const t = docSnap.data() as CloudTaskData;
          list.push(t);
        });

        // Client-side filtering & sorting for maximum safety & offline mode
        if (filterOptions.projectId) {
          list = list.filter((t) => t.projectId === filterOptions.projectId);
        }
        if (filterOptions.status) {
          list = list.filter((t) => t.status === filterOptions.status);
        }
        if (!filterOptions.includeArchived) {
          list = list.filter((t) => !t.isArchived && !t.isDeleted);
        }

        // Sort by priority and completion
        list.sort((a, b) => (a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1));

        callback(list);
      },
      (error) => {
        console.warn("Firestore tasks listener warning:", error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
