import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  createProject,
  updateProject,
  archiveProject,
  softDeleteProject,
  restoreProject,
  subscribeProjects,
  CloudProjectData
} from '../firebase/projectService';
import {
  createTask,
  updateTask,
  archiveTask,
  restoreTask,
  deleteTask,
  subscribeTasks,
  CloudTaskData
} from '../firebase/taskService';
import {
  createGoal,
  updateGoal,
  updateGoalProgress,
  archiveGoal,
  restoreGoal,
  deleteGoal,
  subscribeGoals,
  CloudGoalData
} from '../firebase/goalService';
import {
  updateUserSettings,
  subscribeUserSettings,
  CloudUserSettingsData
} from '../firebase/settingsService';
import {
  createKnowledgeItem,
  updateKnowledgeItem,
  archiveKnowledgeItem,
  restoreKnowledgeItem,
  softDeleteKnowledgeItem,
  subscribeKnowledgeItems,
  CloudKnowledgeItemData
} from '../firebase/knowledgeService';
import {
  createIdeaItem,
  updateIdeaItem,
  updateIdeaStatus,
  archiveIdeaItem,
  restoreIdeaItem,
  softDeleteIdeaItem,
  subscribeIdeaItems,
  CloudIdeaItemData
} from '../firebase/ideaService';
import {
  createMemory,
  updateMemory,
  archiveMemory,
  restoreMemory,
  softDeleteMemory,
  subscribeMemories,
  CloudMemoryData
} from '../firebase/memoryService';

export function usePhase1BSync() {
  const { user, isFirebaseAvailable } = useAuth();
  const [cloudSyncActive, setCloudSyncActive] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  // 1. Projects Realtime Listener & Sync
  useEffect(() => {
    if (!user || !isFirebaseAvailable) {
      setCloudSyncActive(false);
      return;
    }

    setCloudSyncActive(true);
    setSyncStatus('syncing');

    const unsubscribe = subscribeProjects(
      user.uid,
      (cloudProjects) => {
        if (cloudProjects && cloudProjects.length > 0) {
          // Merge with localStorage
          try {
            const stored = localStorage.getItem('aurora_projects_v2');
            let localList: any[] = stored ? JSON.parse(stored) : [];
            
            // Map cloud projects into local list format while keeping local active state
            const mergedMap = new Map<string, any>();
            localList.forEach((p) => mergedMap.set(p.id, p));
            cloudProjects.forEach((cp) => {
              const existing = mergedMap.get(cp.id) || {};
              mergedMap.set(cp.id, { ...existing, ...cp });
            });

            const mergedList = Array.from(mergedMap.values());
            localStorage.setItem('aurora_projects_v2', JSON.stringify(mergedList));
          } catch (e) {
            console.warn("Failed merging cloud projects into localStorage:", e);
          }
        }
        setSyncStatus('synced');
      },
      (err) => {
        console.warn("Projects sync error:", err);
        setSyncStatus('error');
      }
    );

    return () => unsubscribe();
  }, [user, isFirebaseAvailable]);

  // 2. Tasks Realtime Listener & Sync
  useEffect(() => {
    if (!user || !isFirebaseAvailable) return;

    const unsubscribe = subscribeTasks(
      user.uid,
      { includeArchived: true },
      (cloudTasks) => {
        if (cloudTasks) {
          try {
            localStorage.setItem('aurora_tasks_v1', JSON.stringify(cloudTasks));
          } catch (e) {
            console.warn("Failed saving cloud tasks to localStorage:", e);
          }
        }
      }
    );

    return () => unsubscribe();
  }, [user, isFirebaseAvailable]);

  // 3. Goals Realtime Listener & Sync
  useEffect(() => {
    if (!user || !isFirebaseAvailable) return;

    const unsubscribe = subscribeGoals(
      user.uid,
      (cloudGoals) => {
        if (cloudGoals) {
          try {
            localStorage.setItem('aurora_goals_v1', JSON.stringify(cloudGoals));
          } catch (e) {
            console.warn("Failed saving cloud goals to localStorage:", e);
          }
        }
      }
    );

    return () => unsubscribe();
  }, [user, isFirebaseAvailable]);

  // 4. User Settings Realtime Listener & Sync
  useEffect(() => {
    if (!user || !isFirebaseAvailable) return;

    const unsubscribe = subscribeUserSettings(
      user.uid,
      'app_settings',
      (settings) => {
        if (settings) {
          try {
            localStorage.setItem('aurora_app_settings_v1', JSON.stringify(settings));
          } catch (e) {
            console.warn("Failed saving cloud settings to localStorage:", e);
          }
        }
      }
    );

    return () => unsubscribe();
  }, [user, isFirebaseAvailable]);

  // 5. Knowledge Library Realtime Listener & Sync
  useEffect(() => {
    if (!user || !isFirebaseAvailable) return;

    const unsubscribe = subscribeKnowledgeItems(
      user.uid,
      (cloudItems) => {
        if (cloudItems && cloudItems.length > 0) {
          try {
            const stored = localStorage.getItem('aurora_knowledge_library_v1');
            let localList: any[] = stored ? JSON.parse(stored) : [];

            const mergedMap = new Map<string, any>();
            localList.forEach((item) => mergedMap.set(item.id, item));
            cloudItems.forEach((ci) => {
              const existing = mergedMap.get(ci.id) || {};
              mergedMap.set(ci.id, { ...existing, ...ci });
            });

            const mergedList = Array.from(mergedMap.values());
            localStorage.setItem('aurora_knowledge_library_v1', JSON.stringify(mergedList));
          } catch (e) {
            console.warn("Failed merging cloud knowledge items into localStorage:", e);
          }
        }
      }
    );

    return () => unsubscribe();
  }, [user, isFirebaseAvailable]);

  // 6. Idea Vault Realtime Listener & Sync
  useEffect(() => {
    if (!user || !isFirebaseAvailable) return;

    const unsubscribe = subscribeIdeaItems(
      user.uid,
      (cloudIdeas) => {
        if (cloudIdeas && cloudIdeas.length > 0) {
          try {
            const stored = localStorage.getItem('aurora_idea_vault_v1');
            let localList: any[] = stored ? JSON.parse(stored) : [];

            const mergedMap = new Map<string, any>();
            localList.forEach((idea) => mergedMap.set(idea.id, idea));
            cloudIdeas.forEach((ci) => {
              const existing = mergedMap.get(ci.id) || {};
              mergedMap.set(ci.id, { ...existing, ...ci });
            });

            const mergedList = Array.from(mergedMap.values());
            localStorage.setItem('aurora_idea_vault_v1', JSON.stringify(mergedList));
          } catch (e) {
            console.warn("Failed merging cloud ideas into localStorage:", e);
          }
        }
      }
    );

    return () => unsubscribe();
  }, [user, isFirebaseAvailable]);

  // 7. Memory Cloud Foundation Listener & Sync
  useEffect(() => {
    if (!user || !isFirebaseAvailable) return;

    const unsubscribe = subscribeMemories(
      user.uid,
      (cloudMemories) => {
        if (cloudMemories && cloudMemories.length > 0) {
          try {
            const stored = localStorage.getItem('aurora_memory_v1');
            let localList: any[] = stored ? JSON.parse(stored) : [];

            const mergedMap = new Map<string, any>();
            localList.forEach((mem) => mergedMap.set(mem.id, mem));
            cloudMemories.forEach((cm) => {
              const existing = mergedMap.get(cm.id) || {};
              mergedMap.set(cm.id, { ...existing, ...cm });
            });

            const mergedList = Array.from(mergedMap.values());
            localStorage.setItem('aurora_memory_v1', JSON.stringify(mergedList));
          } catch (e) {
            console.warn("Failed merging cloud memories into localStorage:", e);
          }
        }
      }
    );

    return () => unsubscribe();
  }, [user, isFirebaseAvailable]);

  // --- Project Sync Helpers ---
  const syncCreateProject = useCallback(async (projectData: Partial<CloudProjectData>) => {
    if (user && isFirebaseAvailable) {
      try {
        await createProject(user.uid, projectData);
      } catch (err) {
        console.warn("Cloud createProject failed, preserving local state:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncUpdateProject = useCallback(async (projectId: string, updates: Partial<CloudProjectData>) => {
    if (user && isFirebaseAvailable) {
      try {
        await updateProject(user.uid, projectId, updates);
      } catch (err) {
        console.warn("Cloud updateProject failed, preserving local state:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncArchiveProject = useCallback(async (projectId: string) => {
    if (user && isFirebaseAvailable) {
      try {
        await archiveProject(user.uid, projectId);
      } catch (err) {
        console.warn("Cloud archiveProject failed, preserving local state:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncSoftDeleteProject = useCallback(async (projectId: string) => {
    if (user && isFirebaseAvailable) {
      try {
        await softDeleteProject(user.uid, projectId);
      } catch (err) {
        console.warn("Cloud softDeleteProject failed, preserving local state:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncRestoreProject = useCallback(async (projectId: string) => {
    if (user && isFirebaseAvailable) {
      try {
        await restoreProject(user.uid, projectId);
      } catch (err) {
        console.warn("Cloud restoreProject failed, preserving local state:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  // --- Task Sync Helpers ---
  const syncCreateTask = useCallback(async (taskData: Partial<CloudTaskData>) => {
    if (user && isFirebaseAvailable) {
      try {
        await createTask(user.uid, taskData);
      } catch (err) {
        console.warn("Cloud createTask failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncUpdateTask = useCallback(async (taskId: string, updates: Partial<CloudTaskData>) => {
    if (user && isFirebaseAvailable) {
      try {
        await updateTask(user.uid, taskId, updates);
      } catch (err) {
        console.warn("Cloud updateTask failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncArchiveTask = useCallback(async (taskId: string) => {
    if (user && isFirebaseAvailable) {
      try {
        await archiveTask(user.uid, taskId);
      } catch (err) {
        console.warn("Cloud archiveTask failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncRestoreTask = useCallback(async (taskId: string) => {
    if (user && isFirebaseAvailable) {
      try {
        await restoreTask(user.uid, taskId);
      } catch (err) {
        console.warn("Cloud restoreTask failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncDeleteTask = useCallback(async (taskId: string) => {
    if (user && isFirebaseAvailable) {
      try {
        await deleteTask(user.uid, taskId);
      } catch (err) {
        console.warn("Cloud deleteTask failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  // --- Goal Sync Helpers ---
  const syncCreateGoal = useCallback(async (goalData: Partial<CloudGoalData>) => {
    if (user && isFirebaseAvailable) {
      try {
        await createGoal(user.uid, goalData);
      } catch (err) {
        console.warn("Cloud createGoal failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncUpdateGoal = useCallback(async (goalId: string, updates: Partial<CloudGoalData>) => {
    if (user && isFirebaseAvailable) {
      try {
        await updateGoal(user.uid, goalId, updates);
      } catch (err) {
        console.warn("Cloud updateGoal failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncUpdateGoalProgress = useCallback(async (goalId: string, progress: number, currentValue?: number) => {
    if (user && isFirebaseAvailable) {
      try {
        await updateGoalProgress(user.uid, goalId, progress, currentValue);
      } catch (err) {
        console.warn("Cloud updateGoalProgress failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncArchiveGoal = useCallback(async (goalId: string) => {
    if (user && isFirebaseAvailable) {
      try {
        await archiveGoal(user.uid, goalId);
      } catch (err) {
        console.warn("Cloud archiveGoal failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncRestoreGoal = useCallback(async (goalId: string) => {
    if (user && isFirebaseAvailable) {
      try {
        await restoreGoal(user.uid, goalId);
      } catch (err) {
        console.warn("Cloud restoreGoal failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncDeleteGoal = useCallback(async (goalId: string) => {
    if (user && isFirebaseAvailable) {
      try {
        await deleteGoal(user.uid, goalId);
      } catch (err) {
        console.warn("Cloud deleteGoal failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  // --- Settings Sync Helper ---
  const syncUpdateSettings = useCallback(async (settings: Partial<CloudUserSettingsData>) => {
    if (user && isFirebaseAvailable) {
      try {
        await updateUserSettings(user.uid, 'app_settings', settings);
      } catch (err) {
        console.warn("Cloud updateUserSettings failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  // --- Knowledge Items Sync Helpers ---
  const syncCreateKnowledgeItem = useCallback(async (itemData: Partial<CloudKnowledgeItemData>) => {
    if (user && isFirebaseAvailable) {
      try {
        await createKnowledgeItem(user.uid, itemData);
      } catch (err) {
        console.warn("Cloud createKnowledgeItem failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncUpdateKnowledgeItem = useCallback(async (itemId: string, updates: Partial<CloudKnowledgeItemData>) => {
    if (user && isFirebaseAvailable) {
      try {
        await updateKnowledgeItem(user.uid, itemId, updates);
      } catch (err) {
        console.warn("Cloud updateKnowledgeItem failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncArchiveKnowledgeItem = useCallback(async (itemId: string) => {
    if (user && isFirebaseAvailable) {
      try {
        await archiveKnowledgeItem(user.uid, itemId);
      } catch (err) {
        console.warn("Cloud archiveKnowledgeItem failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncRestoreKnowledgeItem = useCallback(async (itemId: string) => {
    if (user && isFirebaseAvailable) {
      try {
        await restoreKnowledgeItem(user.uid, itemId);
      } catch (err) {
        console.warn("Cloud restoreKnowledgeItem failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncSoftDeleteKnowledgeItem = useCallback(async (itemId: string) => {
    if (user && isFirebaseAvailable) {
      try {
        await softDeleteKnowledgeItem(user.uid, itemId);
      } catch (err) {
        console.warn("Cloud softDeleteKnowledgeItem failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  // --- Idea Vault Sync Helpers ---
  const syncCreateIdeaItem = useCallback(async (ideaData: Partial<CloudIdeaItemData>) => {
    if (user && isFirebaseAvailable) {
      try {
        await createIdeaItem(user.uid, ideaData);
      } catch (err) {
        console.warn("Cloud createIdeaItem failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncUpdateIdeaItem = useCallback(async (ideaId: string, updates: Partial<CloudIdeaItemData>) => {
    if (user && isFirebaseAvailable) {
      try {
        await updateIdeaItem(user.uid, ideaId, updates);
      } catch (err) {
        console.warn("Cloud updateIdeaItem failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncUpdateIdeaStatus = useCallback(async (ideaId: string, status: string) => {
    if (user && isFirebaseAvailable) {
      try {
        await updateIdeaStatus(user.uid, ideaId, status);
      } catch (err) {
        console.warn("Cloud updateIdeaStatus failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncArchiveIdeaItem = useCallback(async (ideaId: string) => {
    if (user && isFirebaseAvailable) {
      try {
        await archiveIdeaItem(user.uid, ideaId);
      } catch (err) {
        console.warn("Cloud archiveIdeaItem failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncRestoreIdeaItem = useCallback(async (ideaId: string) => {
    if (user && isFirebaseAvailable) {
      try {
        await restoreIdeaItem(user.uid, ideaId);
      } catch (err) {
        console.warn("Cloud restoreIdeaItem failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncSoftDeleteIdeaItem = useCallback(async (ideaId: string) => {
    if (user && isFirebaseAvailable) {
      try {
        await softDeleteIdeaItem(user.uid, ideaId);
      } catch (err) {
        console.warn("Cloud softDeleteIdeaItem failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  // --- Memory Sync Helpers ---
  const syncCreateMemory = useCallback(async (memoryData: Partial<CloudMemoryData>) => {
    if (user && isFirebaseAvailable) {
      try {
        await createMemory(user.uid, memoryData);
      } catch (err) {
        console.warn("Cloud createMemory failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncUpdateMemory = useCallback(async (memoryId: string, updates: Partial<CloudMemoryData>) => {
    if (user && isFirebaseAvailable) {
      try {
        await updateMemory(user.uid, memoryId, updates);
      } catch (err) {
        console.warn("Cloud updateMemory failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncArchiveMemory = useCallback(async (memoryId: string) => {
    if (user && isFirebaseAvailable) {
      try {
        await archiveMemory(user.uid, memoryId);
      } catch (err) {
        console.warn("Cloud archiveMemory failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncRestoreMemory = useCallback(async (memoryId: string) => {
    if (user && isFirebaseAvailable) {
      try {
        await restoreMemory(user.uid, memoryId);
      } catch (err) {
        console.warn("Cloud restoreMemory failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  const syncSoftDeleteMemory = useCallback(async (memoryId: string) => {
    if (user && isFirebaseAvailable) {
      try {
        await softDeleteMemory(user.uid, memoryId);
      } catch (err) {
        console.warn("Cloud softDeleteMemory failed:", err);
      }
    }
  }, [user, isFirebaseAvailable]);

  return {
    cloudSyncActive,
    syncStatus,
    syncCreateProject,
    syncUpdateProject,
    syncArchiveProject,
    syncSoftDeleteProject,
    syncRestoreProject,
    syncCreateTask,
    syncUpdateTask,
    syncArchiveTask,
    syncRestoreTask,
    syncDeleteTask,
    syncCreateGoal,
    syncUpdateGoal,
    syncUpdateGoalProgress,
    syncArchiveGoal,
    syncRestoreGoal,
    syncDeleteGoal,
    syncUpdateSettings,
    syncCreateKnowledgeItem,
    syncUpdateKnowledgeItem,
    syncArchiveKnowledgeItem,
    syncRestoreKnowledgeItem,
    syncSoftDeleteKnowledgeItem,
    syncCreateIdeaItem,
    syncUpdateIdeaItem,
    syncUpdateIdeaStatus,
    syncArchiveIdeaItem,
    syncRestoreIdeaItem,
    syncSoftDeleteIdeaItem,
    syncCreateMemory,
    syncUpdateMemory,
    syncArchiveMemory,
    syncRestoreMemory,
    syncSoftDeleteMemory,
  };
}
