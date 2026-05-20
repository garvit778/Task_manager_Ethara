import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { Calendar, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/page-transition";
import { formatDate } from "@/lib/utils";
import { useBootstrap } from "@/hooks/use-bootstrap";
import { useDataStore } from "@/store/data-store";
import type { TaskStatus } from "@/types";
import type { Task } from "@/types";

const statuses: Array<[TaskStatus, string]> = [
  ["TODO", "Todo"],
  ["IN_PROGRESS", "In Progress"],
  ["COMPLETED", "Completed"]
];

const TaskCard = ({ task }: { task: Task }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id });
  return (
    <motion.div
      ref={setNodeRef}
      style={{ transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined }}
      {...listeners}
      {...attributes}
      layout
      className="cursor-grab rounded-lg border bg-card p-4 shadow-sm active:cursor-grabbing"
    >
      <p className="font-semibold">{task.title}</p>
      <p className="mt-2 text-xs text-muted-foreground">{task.assignee?.name ?? "Unassigned"} · {formatDate(task.dueDate)}</p>
      <Badge className="mt-3">{task.priority}</Badge>
    </motion.div>
  );
};

const KanbanColumn = ({ status, label, tasks }: { status: TaskStatus; label: string; tasks: Task[] }) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div ref={setNodeRef} className={`min-h-96 rounded-lg border bg-background/50 p-3 transition ${isOver ? "ring-2 ring-primary" : ""}`}>
      <h3 className="mb-3 text-sm font-bold">{label}</h3>
      <div className="grid gap-3">
        {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
      </div>
    </div>
  );
};

export const ProjectsPage = () => {
  useBootstrap();
  const { projects, tasks, users, createProject, createTask, updateTask } = useDataStore();
  const [search, setSearch] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const filtered = useMemo(() => projects.filter((project) => project.title.toLowerCase().includes(search.toLowerCase())), [projects, search]);
  const activeProject = filtered[0];

  const onDragEnd = (event: DragEndEvent) => {
    const status = event.over?.id as TaskStatus | undefined;
    const taskId = String(event.active.id);
    if (status && statuses.some(([value]) => value === status)) updateTask(taskId, { status });
  };

  return (
    <PageTransition>
      <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <section className="grid gap-5">
          <Card className="glass">
            <CardHeader><CardTitle>Create project</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
              <Input value={projectTitle} onChange={(event) => setProjectTitle(event.target.value)} placeholder="Project name" />
              <Textarea id="project-description" placeholder="Brief description" defaultValue="High-impact initiative with cross-functional delivery." />
              <Button
                onClick={async () => {
                  if (!projectTitle) return;
                  await createProject({ title: projectTitle, description: (document.getElementById("project-description") as HTMLTextAreaElement).value, priority: "MEDIUM" });
                  setProjectTitle("");
                }}
              >
                <Plus className="h-4 w-4" /> Create project
              </Button>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader><CardTitle>Projects</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search projects" value={search} onChange={(event) => setSearch(event.target.value)} />
              </div>
              {filtered.map((project, index) => (
                <motion.div key={project.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }} className="rounded-lg border bg-background/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold">{project.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                    </div>
                    <Badge>{project.priority}</Badge>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(project.deadline)}</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${project.progress}%` }} /></div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-5">
          <Card className="glass">
            <CardHeader><CardTitle>{activeProject?.title ?? "Kanban board"}</CardTitle></CardHeader>
            <CardContent>
              <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_180px_auto]">
                <Input id="task-title" placeholder="New task title" />
                <select id="task-assignee" className="rounded-md border bg-background px-3 text-sm">
                  <option value="">Unassigned</option>
                  {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
                </select>
                <Button
                  disabled={!activeProject}
                  onClick={() => {
                    const title = (document.getElementById("task-title") as HTMLInputElement).value;
                    const assigneeId = (document.getElementById("task-assignee") as HTMLSelectElement).value || null;
                    if (title && activeProject) createTask({ title, projectId: activeProject.id, assigneeId, priority: "MEDIUM", status: "TODO" });
                  }}
                >
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
              <DndContext onDragEnd={onDragEnd}>
                <div className="grid gap-4 lg:grid-cols-3">
                  {statuses.map(([status, label]) => (
                    <KanbanColumn key={status} status={status} label={label} tasks={tasks.filter((task) => task.status === status && (!activeProject || task.projectId === activeProject.id))} />
                  ))}
                </div>
              </DndContext>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageTransition>
  );
};
