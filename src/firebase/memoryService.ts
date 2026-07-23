import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  limit,
  orderBy,
  runTransaction,
  getDoc
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

  // Conflict & Synchronization Metadata (Phase 2.1 & 2.1.1)
  syncStatus?: 'synced' | 'pending_sync' | 'conflict';
  localUpdatedAt?: string;
  cloudUpdatedAt?: string;
  lastSyncedAt?: string | null;

  createdAt?: unknown;
  updatedAt?: unknown;
  deletedAt?: unknown;
}

export interface QueuedMemoryOp {
  queueId: string;
  memoryId: string;
  opType: 'CREATE' | 'UPDATE' | 'ARCHIVE' | 'RESTORE' | 'SOFT_DELETE';
  payload?: Partial<CloudMemoryData>;
  baseTimestamp?: string; // Captured local base timestamp when op was queued
  timestamp: string;
  retryCount: number;
}

const SYNC_QUEUE_KEY = 'aurora_cloud_memory_sync_queue_v1';

export function getMemorySyncQueue(): QueuedMemoryOp[] {
  try {
    const raw = localStorage.getItem(SYNC_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Failed reading memory sync queue from localStorage:", e);
    return [];
  }
}

export function saveMemorySyncQueue(queue: QueuedMemoryOp[]): void {
  try {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.warn("Failed saving memory sync queue to localStorage:", e);
  }
}

/**
 * Deterministic operation compaction per memory ID (Phase 2.1.1 Task 4)
 */
export function compactMemoryQueue(queue: QueuedMemoryOp[]): QueuedMemoryOp[] {
  const memoryGroups = new Map<string, QueuedMemoryOp[]>();

  for (const op of queue) {
    const group = memoryGroups.get(op.memoryId) || [];
    group.push(op);
    memoryGroups.set(op.memoryId, group);
  }

  const compacted: QueuedMemoryOp[] = [];

  for (const [memoryId, ops] of memoryGroups.entries()) {
    if (ops.length === 1) {
      compacted.push(ops[0]);
      continue;
    }

    let hasCreate = ops.some(o => o.opType === 'CREATE');
    let mergedPayload: Partial<CloudMemoryData> = {};
    let finalOpType: 'CREATE' | 'UPDATE' | 'ARCHIVE' | 'RESTORE' | 'SOFT_DELETE' = hasCreate ? 'CREATE' : 'UPDATE';
    let baseTime = ops[0].baseTimestamp;

    for (const op of ops) {
      if (op.payload) {
        mergedPayload = { ...mergedPayload, ...op.payload };
      }
      if (op.opType === 'SOFT_DELETE') {
        mergedPayload.isDeleted = true;
        if (!hasCreate) finalOpType = 'SOFT_DELETE';
      } else if (op.opType === 'ARCHIVE') {
        mergedPayload.isArchived = true;
        if (!hasCreate && finalOpType !== 'SOFT_DELETE') finalOpType = 'ARCHIVE';
      } else if (op.opType === 'RESTORE') {
        mergedPayload.isDeleted = false;
        mergedPayload.isArchived = false;
        if (!hasCreate) finalOpType = 'RESTORE';
      }
    }

    // If CREATE followed by SOFT_DELETE before cloud push, omit cloud write entirely
    if (hasCreate && mergedPayload.isDeleted) {
      continue;
    }

    compacted.push({
      queueId: `qop-compacted-${Date.now()}-${memoryId}`,
      memoryId,
      opType: finalOpType,
      payload: mergedPayload,
      baseTimestamp: baseTime,
      timestamp: new Date().toISOString(),
      retryCount: 0
    });
  }

  return compacted;
}

export function enqueueMemoryOp(op: Omit<QueuedMemoryOp, 'queueId' | 'timestamp' | 'retryCount'>): void {
  const queue = getMemorySyncQueue();
  const newOp: QueuedMemoryOp = {
    ...op,
    queueId: `qop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    baseTimestamp: op.baseTimestamp || op.payload?.localUpdatedAt || new Date().toISOString(),
    timestamp: new Date().toISOString(),
    retryCount: 0
  };
  const updatedQueue = compactMemoryQueue([...queue, newOp]);
  saveMemorySyncQueue(updatedQueue);
}

let isFlushingQueue = false;

export async function flushMemorySyncQueue(userId: string): Promise<void> {
  if (!db || !userId || isFlushingQueue) return;
  isFlushingQueue = true;

  try {
    const queue = getMemorySyncQueue();
    if (queue.length === 0) return;

    const remainingQueue: QueuedMemoryOp[] = [];

    for (const item of queue) {
      try {
        if (item.opType === 'CREATE' && item.payload) {
          await createMemory(userId, item.payload, false);
        } else if (item.opType === 'UPDATE' && item.payload) {
          await safeUpdateMemoryWithPreCheck(userId, item.memoryId, item.payload, item.baseTimestamp);
        } else if (item.opType === 'ARCHIVE') {
          await safeUpdateMemoryWithPreCheck(userId, item.memoryId, { isArchived: true }, item.baseTimestamp);
        } else if (item.opType === 'RESTORE') {
          await safeUpdateMemoryWithPreCheck(userId, item.memoryId, { isArchived: false, isDeleted: false }, item.baseTimestamp);
        } else if (item.opType === 'SOFT_DELETE') {
          await safeUpdateMemoryWithPreCheck(userId, item.memoryId, { isDeleted: true }, item.baseTimestamp);
        }
      } catch (err) {
        console.warn(`Queue operation ${item.opType} for ${item.memoryId} failed, retaining in queue:`, err);
        item.retryCount += 1;
        if (item.retryCount < 10) {
          remainingQueue.push(item);
        }
      }
    }

    saveMemorySyncQueue(remainingQueue);
  } finally {
    isFlushingQueue = false;
  }
}

/**
 * Centralized timestamp normalization helper (Phase 2.1.2)
 * Safely converts Firestore Timestamp, ISO strings, numbers, Date objects,
 * null/undefined, and unresolved serverTimestamp objects into comparable milliseconds.
 */
export function toComparableMs(val: unknown): number {
  if (val === null || val === undefined) return 0;

  if (typeof val === 'number') {
    return isNaN(val) ? 0 : val;
  }

  if (typeof val === 'string') {
    const parsed = new Date(val).getTime();
    return isNaN(parsed) ? 0 : parsed;
  }

  if (val instanceof Date) {
    const time = val.getTime();
    return isNaN(time) ? 0 : time;
  }

  if (typeof val === 'object') {
    const obj = val as Record<string, unknown>;
    if (typeof obj.toDate === 'function') {
      try {
        const d = (obj.toDate as () => Date)();
        if (d instanceof Date) return d.getTime();
      } catch (e) {
        // Fallthrough
      }
    }
    if (typeof obj.seconds === 'number') {
      return obj.seconds * 1000 + Math.floor(((obj.nanoseconds as number) || 0) / 1000000);
    }
    // Unresolved serverTimestamp placeholder object
    if (obj._methodName === 'serverTimestamp' || obj.constructor?.name === 'FieldValue') {
      return Date.now();
    }
  }

  return 0;
}

/**
 * Saves a recoverable local conflict copy in localStorage without modifying cloud document
 */
export function saveLocalConflictCopy(
  memoryId: string,
  localUpdates: Partial<CloudMemoryData>,
  cloudData: CloudMemoryData
): void {
  try {
    const stored = localStorage.getItem('aurora_persistent_memories_v4');
    let localList: any[] = stored ? JSON.parse(stored) : [];

    const existingIndex = localList.findIndex(m => m.id === memoryId);
    if (existingIndex >= 0) {
      const localItem = localList[existingIndex];
      const conflictCopy = {
        ...localItem,
        ...localUpdates,
        id: `${memoryId}-conflict-${Date.now()}`,
        title: `${localItem.title || localUpdates.title || 'Muisto'} (Ristiriitakopio)`,
        syncStatus: 'conflict',
        localUpdatedAt: new Date().toISOString()
      };

      // Keep cloud version synced as main record, add local conflict copy
      localList[existingIndex] = {
        ...localItem,
        ...cloudData,
        syncStatus: 'synced'
      };
      localList.push(conflictCopy);
      localStorage.setItem('aurora_persistent_memories_v4', JSON.stringify(localList));
    }
  } catch (e) {
    console.warn("Failed saving local conflict copy to localStorage:", e);
  }
}

/**
 * Pre-write conflict check via Firestore transaction (Phase 2.1.2 Atomic & Non-Cloud-Modifying)
 */
export async function safeUpdateMemoryWithPreCheck(
  userId: string,
  memoryId: string,
  updates: Partial<CloudMemoryData>,
  baseTimestamp?: string
): Promise<{ status: 'updated' | 'created' | 'conflict' | 'noop'; cloudData?: CloudMemoryData }> {
  if (!db || !userId || !memoryId) return { status: 'noop' };
  const docRef = doc(db, 'users', userId, 'memories', memoryId);
  const nowIso = new Date().toISOString();

  const { status: resultStatus, cloudData: fetchedCloudData } = await runTransaction(db, async (transaction) => {
    const sfDoc = await transaction.get(docRef);
    if (!sfDoc.exists()) {
      // Document does not exist in cloud yet -> create it
      const payload: CloudMemoryData = {
        id: memoryId,
        memoryType: updates.memoryType || 'Observation',
        title: updates.title || 'Uusi muisto',
        content: updates.content || '',
        summary: updates.summary || '',
        importance: updates.importance ?? 3,
        confidence: updates.confidence ?? 1.0,
        sourceType: updates.sourceType || 'user_input',
        sourceId: updates.sourceId || null,
        relatedProjectIds: updates.relatedProjectIds || [],
        relatedConversationId: updates.relatedConversationId || null,
        tags: updates.tags || ['General'],
        occurredAt: updates.occurredAt || nowIso,
        isPinned: updates.isPinned ?? false,
        isArchived: updates.isArchived ?? false,
        isDeleted: updates.isDeleted ?? false,
        embeddingStatus: updates.embeddingStatus || 'none',
        embeddingModel: updates.embeddingModel || 'none',
        embeddingModelVersion: updates.embeddingModelVersion || '1.0',
        schemaVersion: 1,
        syncStatus: 'synced',
        localUpdatedAt: nowIso,
        cloudUpdatedAt: nowIso,
        lastSyncedAt: nowIso,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...updates
      };
      transaction.set(docRef, payload);
      return { status: 'created' as const };
    }

    const cloudData = sfDoc.data() as CloudMemoryData;
    const cloudTime = toComparableMs(cloudData.cloudUpdatedAt || cloudData.updatedAt || cloudData.localUpdatedAt);
    const localBaseTime = toComparableMs(baseTimestamp || updates.localUpdatedAt);

    // If cloud document has been updated independently since local base edit was made
    if (cloudTime > localBaseTime && cloudData.content !== updates.content) {
      // Conflict detected! DO NOT modify cloud document. Cloud version remains intact.
      console.info(`Conflict detected for memory ${memoryId}. Cloud version preserved intact.`);
      return { status: 'conflict' as const, cloudData };
    }

    // Safe to update cloud document
    transaction.update(docRef, {
      ...updates,
      syncStatus: 'synced',
      localUpdatedAt: updates.localUpdatedAt || nowIso,
      cloudUpdatedAt: nowIso,
      lastSyncedAt: nowIso,
      updatedAt: serverTimestamp()
    });
    return { status: 'updated' as const, cloudData };
  });

  if (resultStatus === 'conflict' && fetchedCloudData) {
    saveLocalConflictCopy(memoryId, updates, fetchedCloudData);
  }

  return { status: resultStatus, cloudData: fetchedCloudData };
}

export async function createMemory(
  userId: string,
  memory: Partial<CloudMemoryData>,
  enqueueOnFailure = true
): Promise<string> {
  const memoryId = memory.id || `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const nowIso = new Date().toISOString();

  if (!db || !userId) {
    if (enqueueOnFailure) {
      enqueueMemoryOp({ memoryId, opType: 'CREATE', payload: memory });
    }
    return memoryId;
  }

  const path = `users/${userId}/memories/${memoryId}`;
  try {
    const docRef = doc(db, 'users', userId, 'memories', memoryId);

    await runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(docRef);
      if (sfDoc.exists()) {
        const cloudData = sfDoc.data() as CloudMemoryData;
        const cloudTime = toComparableMs(cloudData.cloudUpdatedAt || cloudData.updatedAt);
        const localBaseTime = toComparableMs(memory.localUpdatedAt || nowIso);

        if (cloudTime > localBaseTime && cloudData.content !== memory.content) {
          // Cloud doc already exists & updated independently -> preserve cloud doc, create local conflict copy
          saveLocalConflictCopy(memoryId, memory, cloudData);
          return;
        }

        // Idempotent atomic update of existing document
        transaction.update(docRef, {
          ...memory,
          syncStatus: 'synced',
          localUpdatedAt: memory.localUpdatedAt || nowIso,
          cloudUpdatedAt: nowIso,
          lastSyncedAt: nowIso,
          updatedAt: serverTimestamp()
        });
        return;
      }

      // Create new document atomically
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
        occurredAt: memory.occurredAt || nowIso,
        isPinned: memory.isPinned ?? false,
        isArchived: memory.isArchived ?? false,
        isDeleted: memory.isDeleted ?? false,
        embeddingStatus: memory.embeddingStatus || 'none',
        embeddingModel: memory.embeddingModel || 'none',
        embeddingModelVersion: memory.embeddingModelVersion || '1.0',
        schemaVersion: 1,

        syncStatus: 'synced',
        localUpdatedAt: memory.localUpdatedAt || nowIso,
        cloudUpdatedAt: nowIso,
        lastSyncedAt: nowIso,

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      transaction.set(docRef, payload);
    });

    return memoryId;
  } catch (error) {
    if (enqueueOnFailure) {
      enqueueMemoryOp({ memoryId, opType: 'CREATE', payload: memory });
    }
    handleFirestoreError(error, OperationType.WRITE, path);
    return memoryId;
  }
}

export async function updateMemory(
  userId: string,
  memoryId: string,
  updates: Partial<CloudMemoryData>,
  enqueueOnFailure = true
): Promise<void> {
  const nowIso = new Date().toISOString();

  if (!db || !userId || !memoryId) {
    if (enqueueOnFailure) {
      enqueueMemoryOp({ memoryId, opType: 'UPDATE', payload: updates });
    }
    return;
  }

  const path = `users/${userId}/memories/${memoryId}`;
  try {
    await safeUpdateMemoryWithPreCheck(userId, memoryId, updates, updates.localUpdatedAt);
  } catch (error) {
    if (enqueueOnFailure) {
      enqueueMemoryOp({ memoryId, opType: 'UPDATE', payload: updates });
    }
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function archiveMemory(userId: string, memoryId: string, enqueueOnFailure = true): Promise<void> {
  return updateMemory(userId, memoryId, { isArchived: true }, enqueueOnFailure);
}

export async function restoreMemory(userId: string, memoryId: string, enqueueOnFailure = true): Promise<void> {
  return updateMemory(userId, memoryId, { isArchived: false, isDeleted: false }, enqueueOnFailure);
}

export async function softDeleteMemory(userId: string, memoryId: string, enqueueOnFailure = true): Promise<void> {
  return updateMemory(userId, memoryId, { isDeleted: true, deletedAt: serverTimestamp() }, enqueueOnFailure);
}

export async function deleteMemory(userId: string, memoryId: string): Promise<void> {
  if (!db || !userId || !memoryId) return;
  const path = `users/${userId}/memories/${memoryId}`;
  try {
    const docRef = doc(db, 'users', userId, 'memories', memoryId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeMemories(
  userId: string,
  callback: (memories: CloudMemoryData[]) => void,
  onError?: (err: unknown) => void,
  maxLimit = 100
): () => void {
  if (!db || !userId) {
    callback([]);
    return () => {};
  }
  const path = `users/${userId}/memories`;
  try {
    const colRef = collection(db, 'users', userId, 'memories');
    
    // Deterministic ordered query (Phase 2.1.1 Task 1)
    let boundedQuery;
    try {
      boundedQuery = query(colRef, orderBy("updatedAt", "desc"), limit(maxLimit));
    } catch (e) {
      console.warn("Fallback to un-ordered memory query limit:", e);
      boundedQuery = query(colRef, limit(maxLimit));
    }

    return onSnapshot(
      boundedQuery,
      (snapshot) => {
        const list: CloudMemoryData[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as CloudMemoryData);
        });
        // Client-side deterministic sorting by timestamp desc
        list.sort((a, b) => {
          const timeA = toComparableMs(a.updatedAt || a.cloudUpdatedAt || a.occurredAt || a.localUpdatedAt);
          const timeB = toComparableMs(b.updatedAt || b.cloudUpdatedAt || b.occurredAt || b.localUpdatedAt);
          return timeB - timeA;
        });
        callback(list);
      },
      (error) => {
        console.warn("Firestore memories listener warning, attempting fallback query:", error);
        // Fallback to simple limit if index or ordering issue occurs
        try {
          const fallbackQuery = query(colRef, limit(maxLimit));
          return onSnapshot(
            fallbackQuery,
            (fallbackSnap) => {
              const list: CloudMemoryData[] = [];
              fallbackSnap.forEach((docSnap) => {
                list.push(docSnap.data() as CloudMemoryData);
              });
              list.sort((a, b) => {
                const timeA = toComparableMs(a.updatedAt || a.cloudUpdatedAt || a.occurredAt || a.localUpdatedAt);
                const timeB = toComparableMs(b.updatedAt || b.cloudUpdatedAt || b.occurredAt || b.localUpdatedAt);
                return timeB - timeA;
              });
              callback(list);
            },
            (err2) => {
              if (onError) onError(err2);
            }
          );
        } catch (err3) {
          if (onError) onError(error);
        }
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

