import { auth, isConfigValid } from '../firebase/firebaseConfig';
import {
  createMemory,
  updateMemory,
  archiveMemory,
  restoreMemory,
  softDeleteMemory,
  enqueueMemoryOp,
  flushMemorySyncQueue,
  CloudMemoryData
} from '../firebase/memoryService';
import { Memory } from '../types';

export function categoryToMemoryType(category?: string): string {
  switch (category) {
    case 'Studies': return 'Fact';
    case 'Ideas': return 'Idea';
    case 'Projects': return 'Milestone';
    case 'Qvick Games': return 'Milestone';
    case 'Personal': return 'Observation';
    case 'Aurora': return 'Reflection';
    case 'Certificates': return 'Fact';
    case 'Education': return 'Fact';
    case 'Personal Milestones': return 'Milestone';
    default: return 'Observation';
  }
}

export function memoryTypeToCategory(memoryType?: string): any {
  switch (memoryType) {
    case 'Fact': return 'Studies';
    case 'Idea': return 'Ideas';
    case 'Milestone': return 'Projects';
    case 'Observation': return 'Personal';
    case 'Reflection': return 'Aurora';
    case 'Insight': return 'Ideas';
    default: return 'Personal';
  }
}

export function mapMemoryToCloudPayload(mem: Partial<Memory>): Partial<CloudMemoryData> {
  const now = new Date().toISOString();
  const text = mem.text || '';
  const category = mem.category || 'Personal';

  return {
    id: mem.id,
    memoryType: categoryToMemoryType(category),
    title: mem.title || (text.length > 50 ? text.substring(0, 47) + '...' : (text || 'Muisto')),
    content: text,
    summary: text.length > 100 ? text.substring(0, 97) + '...' : text,
    importance: mem.importance !== undefined ? mem.importance : 3,
    confidence: 1.0,
    sourceType: 'user_input',
    relatedProjectIds: mem.projectId ? [mem.projectId] : [],
    tags: mem.tags && mem.tags.length > 0 ? mem.tags : [category],
    occurredAt: mem.createdAt || now,
    isPinned: mem.isPinned || false,
    isArchived: mem.isArchived || false,
    isDeleted: mem.isDeleted || false,
    embeddingStatus: 'none',
    schemaVersion: 1,
    localUpdatedAt: mem.localUpdatedAt || now,
    syncStatus: 'pending_sync'
  };
}

class CloudMemorySyncAdapter {
  private isInitialized = false;

  public initializeCloudMemorySync(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;
    console.info('[CloudMemorySyncAdapter] Cloud memory sync adapter initialized');
  }

  public async queueMemoryCreate(mem: Memory): Promise<void> {
    try {
      this.initializeCloudMemorySync();
      const payload = mapMemoryToCloudPayload(mem);
      const userId = auth?.currentUser?.uid;

      if (userId && isConfigValid) {
        createMemory(userId, payload, true).catch(err => {
          console.warn('[CloudMemorySyncAdapter] Background createMemory warning:', err);
        });
      } else {
        enqueueMemoryOp({
          memoryId: mem.id,
          ownerUid: userId || 'unassigned',
          opType: 'CREATE',
          payload,
          baseTimestamp: mem.createdAt || new Date().toISOString()
        });
        console.info(`[CloudMemorySyncAdapter] Queued CREATE for memory ${mem.id} (unauthenticated/offline)`);
      }
    } catch (err) {
      console.warn('[CloudMemorySyncAdapter] queueMemoryCreate safe catch:', err);
    }
  }

  public async queueMemoryUpdate(memoryId: string, updates: Partial<Memory>): Promise<void> {
    try {
      this.initializeCloudMemorySync();
      const payload = mapMemoryToCloudPayload(updates);
      const userId = auth?.currentUser?.uid;

      if (userId && isConfigValid) {
        updateMemory(userId, memoryId, payload, true).catch(err => {
          console.warn('[CloudMemorySyncAdapter] Background updateMemory warning:', err);
        });
      } else {
        enqueueMemoryOp({
          memoryId,
          ownerUid: userId || 'unassigned',
          opType: 'UPDATE',
          payload,
          baseTimestamp: updates.localUpdatedAt || new Date().toISOString()
        });
        console.info(`[CloudMemorySyncAdapter] Queued UPDATE for memory ${memoryId} (unauthenticated/offline)`);
      }
    } catch (err) {
      console.warn('[CloudMemorySyncAdapter] queueMemoryUpdate safe catch:', err);
    }
  }

  public async queueMemoryArchive(memoryId: string): Promise<void> {
    try {
      this.initializeCloudMemorySync();
      const userId = auth?.currentUser?.uid;

      if (userId && isConfigValid) {
        archiveMemory(userId, memoryId, true).catch(err => {
          console.warn('[CloudMemorySyncAdapter] Background archiveMemory warning:', err);
        });
      } else {
        enqueueMemoryOp({
          memoryId,
          ownerUid: userId || 'unassigned',
          opType: 'ARCHIVE',
          payload: { isArchived: true, localUpdatedAt: new Date().toISOString() },
          baseTimestamp: new Date().toISOString()
        });
        console.info(`[CloudMemorySyncAdapter] Queued ARCHIVE for memory ${memoryId}`);
      }
    } catch (err) {
      console.warn('[CloudMemorySyncAdapter] queueMemoryArchive safe catch:', err);
    }
  }

  public async queueMemoryRestore(memoryId: string): Promise<void> {
    try {
      this.initializeCloudMemorySync();
      const userId = auth?.currentUser?.uid;

      if (userId && isConfigValid) {
        restoreMemory(userId, memoryId, true).catch(err => {
          console.warn('[CloudMemorySyncAdapter] Background restoreMemory warning:', err);
        });
      } else {
        enqueueMemoryOp({
          memoryId,
          ownerUid: userId || 'unassigned',
          opType: 'RESTORE',
          payload: { isArchived: false, isDeleted: false, localUpdatedAt: new Date().toISOString() },
          baseTimestamp: new Date().toISOString()
        });
        console.info(`[CloudMemorySyncAdapter] Queued RESTORE for memory ${memoryId}`);
      }
    } catch (err) {
      console.warn('[CloudMemorySyncAdapter] queueMemoryRestore safe catch:', err);
    }
  }

  public async queueMemorySoftDelete(memoryId: string): Promise<void> {
    try {
      this.initializeCloudMemorySync();
      const userId = auth?.currentUser?.uid;

      if (userId && isConfigValid) {
        softDeleteMemory(userId, memoryId, true).catch(err => {
          console.warn('[CloudMemorySyncAdapter] Background softDeleteMemory warning:', err);
        });
      } else {
        enqueueMemoryOp({
          memoryId,
          ownerUid: userId || 'unassigned',
          opType: 'SOFT_DELETE',
          payload: { isDeleted: true, localUpdatedAt: new Date().toISOString() },
          baseTimestamp: new Date().toISOString()
        });
        console.info(`[CloudMemorySyncAdapter] Queued SOFT_DELETE for memory ${memoryId}`);
      }
    } catch (err) {
      console.warn('[CloudMemorySyncAdapter] queueMemorySoftDelete safe catch:', err);
    }
  }

  public async flushPendingMemorySync(): Promise<void> {
    try {
      const userId = auth?.currentUser?.uid;
      if (userId && isConfigValid) {
        console.info('[CloudMemorySyncAdapter] Queue flush started');
        await flushMemorySyncQueue(userId);
        console.info('[CloudMemorySyncAdapter] Queue flush completed');
      }
    } catch (err) {
      console.warn('[CloudMemorySyncAdapter] flushPendingMemorySync catch:', err);
    }
  }
}

export const cloudMemorySyncAdapter = new CloudMemorySyncAdapter();
