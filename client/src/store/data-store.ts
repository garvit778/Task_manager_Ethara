import { create } from "zustand";
import { api } from "@/lib/api";
import type { Project, Task, User } from "@/types";

interface DashboardData {
  metrics: Record<string, number>;
  statusCounts: Array<{ status: string; count: number }>;
  priorityCounts: Array<{ priority: string; count: number }>;
  recentActivity: Array<any>;
  productivity: Array<{ name: string; assigned: number; completed: number }>;
  sparkSnapshots: Array<{
    id: string;
    projectId: string;
    projectTitle: string;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
    completionRate: number;
    snapshotAt: string;
  }>;
}

interface DataState {
  loading: boolean;
  projects: Project[];
  tasks: Task[];
  users: User[];
  dashboard: DashboardData | null;
  loadAll: () => Promise<void>;
  createProject: (payload: Partial<Project>) => Promise<void>;
  createTask: (payload: Partial<Task>) => Promise<void>;
  updateTask: (id: string, payload: Partial<Task>) => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  loading: false,
  projects: [],
  tasks: [],
  users: [],
  dashboard: null,
  loadAll: async () => {
    set({ loading: true });
    const [dashboard, projects, tasks, users] = await Promise.all([
      api.get("/dashboard"),
      api.get("/projects"),
      api.get("/tasks"),
      api.get("/users")
    ]);
    set({
      dashboard: dashboard.data.data,
      projects: projects.data.data.projects,
      tasks: tasks.data.data.tasks,
      users: users.data.data.users,
      loading: false
    });
  },
  createProject: async (payload) => {
    await api.post("/projects", payload);
    await get().loadAll();
  },
  createTask: async (payload) => {
    await api.post("/tasks", payload);
    await get().loadAll();
  },
  updateTask: async (id, payload) => {
    await api.patch(`/tasks/${id}`, payload);
    await get().loadAll();
  }
}));
