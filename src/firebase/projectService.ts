import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { handleFirestoreError, OperationType } from './firestoreError';

export interface CloudProjectData {
  id: string;
  name: string;
  description: string;
  isActive?: boolean;
  isArchived?: boolean;
  isDeleted?: boolean;
  status?: string;
  priority?: string;
  category?: string;
  progress?: number;
  subProgress?: Record<string, number>;
  technologies?: string[];
  platform?: string[];
  schemaVersion: number;
  createdAt?: unknown;
  updatedAt?: unknown;
  deletedAt?: unknown;
}

export interface CloudMilestoneData {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  dueDate?: string | null;
  isCompleted?: boolean;
  completedAt?: unknown;
  isArchived?: boolean;
  order?: number;
  schemaVersion: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export async function createProject(userId: string, project: Partial<CloudProjectData>): Promise<string> {
  if (!db || !userId) throw new Error("Firestore instance or userId missing");
  const projectId = project.id || `proj-${Date.now()}`;
  const path = `users/${userId}/projects/${projectId}`;
  try {
    const docRef = doc(db, 'users', userId, 'projects', projectId);
    const payload: CloudProjectData = {
      id: projectId,
      name: project.name || 'Uusi Projekti',
      description: project.description || '',
      isActive: project.isActive ?? false,
      isArchived: false,
      isDeleted: false,
      status: project.status || 'In Development',
      priority: project.priority || 'Normal',
      category: project.category || 'Game',
      progress: project.progress ?? 0,
      subProgress: project.subProgress || { visual: 0, story: 0, audio: 0, testing: 0, code: 0 },
      technologies: project.technologies || [],
      platform: project.platform || ['Web'],
      schemaVersion: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(docRef, payload, { merge: true });
    return projectId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateProject(userId: string, projectId: string, updates: Partial<CloudProjectData>): Promise<void> {
  if (!db || !userId || !projectId) return;
  const path = `users/${userId}/projects/${projectId}`;
  try {
    const docRef = doc(db, 'users', userId, 'projects', projectId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function archiveProject(userId: string, projectId: string): Promise<void> {
  return updateProject(userId, projectId, { isArchived: true, status: 'Archived' });
}

export async function softDeleteProject(userId: string, projectId: string): Promise<void> {
  return updateProject(userId, projectId, { isDeleted: true, deletedAt: serverTimestamp() });
}

export async function restoreProject(userId: string, projectId: string): Promise<void> {
  return updateProject(userId, projectId, { isArchived: false, isDeleted: false, deletedAt: null });
}

export function subscribeProjects(
  userId: string,
  callback: (projects: CloudProjectData[]) => void,
  onError?: (err: unknown) => void
): () => void {
  if (!db || !userId) {
    callback([]);
    return () => {};
  }
  const path = `users/${userId}/projects`;
  try {
    const colRef = collection(db, 'users', userId, 'projects');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: CloudProjectData[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as CloudProjectData);
        });
        callback(list);
      },
      (error) => {
        console.warn("Firestore projects listener warning:", error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Milestone subcollection methods
export async function createMilestone(userId: string, projectId: string, milestone: Partial<CloudMilestoneData>): Promise<string> {
  if (!db || !userId || !projectId) throw new Error("Missing parameters");
  const milestoneId = milestone.id || `m-` + Date.now();
  const path = `users/${userId}/projects/${projectId}/milestones/${milestoneId}`;
  try {
    const docRef = doc(db, 'users', userId, 'projects', projectId, 'milestones', milestoneId);
    const payload: CloudMilestoneData = {
      id: milestoneId,
      projectId,
      title: milestone.title || 'Uusi Virstanpylväs',
      description: milestone.description || '',
      dueDate: milestone.dueDate || null,
      isCompleted: milestone.isCompleted ?? false,
      completedAt: milestone.isCompleted ? serverTimestamp() : null,
      isArchived: false,
      order: milestone.order ?? 0,
      schemaVersion: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(docRef, payload, { merge: true });
    return milestoneId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateMilestone(
  userId: string,
  projectId: string,
  milestoneId: string,
  updates: Partial<CloudMilestoneData>
): Promise<void> {
  if (!db || !userId || !projectId || !milestoneId) return;
  const path = `users/${userId}/projects/${projectId}/milestones/${milestoneId}`;
  try {
    const docRef = doc(db, 'users', userId, 'projects', projectId, 'milestones', milestoneId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function completeMilestone(userId: string, projectId: string, milestoneId: string): Promise<void> {
  return updateMilestone(userId, projectId, milestoneId, { isCompleted: true, completedAt: serverTimestamp() });
}

export async function archiveMilestone(userId: string, projectId: string, milestoneId: string): Promise<void> {
  return updateMilestone(userId, projectId, milestoneId, { isArchived: true });
}

export async function restoreMilestone(userId: string, projectId: string, milestoneId: string): Promise<void> {
  return updateMilestone(userId, projectId, milestoneId, { isArchived: false });
}

export function subscribeMilestones(
  userId: string,
  projectId: string,
  callback: (milestones: CloudMilestoneData[]) => void,
  onError?: (err: unknown) => void
): () => void {
  if (!db || !userId || !projectId) {
    callback([]);
    return () => {};
  }
  const path = `users/${userId}/projects/${projectId}/milestones`;
  try {
    const colRef = collection(db, 'users', userId, 'projects', projectId, 'milestones');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: CloudMilestoneData[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as CloudMilestoneData);
        });
        callback(list);
      },
      (error) => {
        console.warn("Firestore milestones listener warning:", error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
