export type Role = "ADMIN" | "MEMBER";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string | null;
  jobTitle?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string | null;
  order: number;
  projectId: string;
  assigneeId?: string | null;
  assignee?: User | null;
  comments?: Array<{ id: string; body: string; createdAt: string; author: User }>;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  deadline?: string | null;
  priority: Priority;
  progress: number;
  owner: User;
  tasks: Task[];
  team?: { id: string; name: string; members: Array<{ user: User }> } | null;
  activities?: Activity[];
}

export interface Activity {
  id: string;
  message: string;
  type: string;
  createdAt: string;
  user: { name: string; avatarUrl?: string | null };
  project?: { title: string } | null;
}
