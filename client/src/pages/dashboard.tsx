import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CheckCircle2, Clock3, DatabaseZap, FolderKanban, ListTodo, TimerReset } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageTransition } from "@/components/page-transition";
import { formatDate } from "@/lib/utils";
import { useDataStore } from "@/store/data-store";
import { useBootstrap } from "@/hooks/use-bootstrap";

const metricMap = [
  ["totalProjects", "Total projects", FolderKanban],
  ["totalTasks", "Total tasks", ListTodo],
  ["completedTasks", "Completed", CheckCircle2],
  ["pendingTasks", "Pending", Clock3],
  ["overdueTasks", "Overdue", TimerReset]
] as const;

const colors = ["#14b8a6", "#f97316", "#6366f1", "#ef4444"];

export const DashboardPage = () => {
  useBootstrap();
  const { dashboard, loading } = useDataStore();

  if (loading && !dashboard) {
    return <div className="grid gap-4 md:grid-cols-3"><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /></div>;
  }

  return (
    <PageTransition>
      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {metricMap.map(([key, label, Icon], index) => (
            <motion.div key={key} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
              <Card className="glass overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-black">{dashboard?.metrics?.[key] ?? 0}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <Card className="glass">
            <CardHeader><CardTitle>Task flow</CardTitle></CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard?.statusCounts ?? []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="status" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#14b8a6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader><CardTitle>Priority mix</CardTitle></CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dashboard?.priorityCounts ?? []} dataKey="count" nameKey="priority" innerRadius={58} outerRadius={105} paddingAngle={3}>
                    {(dashboard?.priorityCounts ?? []).map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <Card className="glass">
            <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
            <CardContent className="grid gap-4">
              {(dashboard?.recentActivity ?? []).map((item) => (
                <div key={item.id} className="flex gap-3 rounded-md border bg-background/50 p-3">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
                  <div>
                    <p className="text-sm font-semibold">{item.message}</p>
                    <p className="text-xs text-muted-foreground">{item.user?.name} · {formatDate(item.createdAt)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader><CardTitle>Team productivity</CardTitle></CardHeader>
            <CardContent className="grid gap-4">
              {(dashboard?.productivity ?? []).map((person) => (
                <div key={person.name}>
                  <div className="mb-2 flex justify-between text-sm"><span className="font-semibold">{person.name}</span><span>{person.completed}/{person.assigned}</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${person.assigned ? (person.completed / person.assigned) * 100 : 0}%` }} /></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DatabaseZap className="h-5 w-5 text-primary" />
              PySpark analytics snapshots
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {(dashboard?.sparkSnapshots ?? []).length ? (
              dashboard!.sparkSnapshots.map((snapshot) => (
                <div key={snapshot.id} className="rounded-lg border bg-background/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold">{snapshot.projectTitle}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">Snapshot: {formatDate(snapshot.snapshotAt)}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">{snapshot.completionRate}%</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-md bg-muted p-2"><p className="font-bold">{snapshot.totalTasks}</p><p className="text-muted-foreground">Total</p></div>
                    <div className="rounded-md bg-muted p-2"><p className="font-bold">{snapshot.completedTasks}</p><p className="text-muted-foreground">Done</p></div>
                    <div className="rounded-md bg-muted p-2"><p className="font-bold">{snapshot.overdueTasks}</p><p className="text-muted-foreground">Late</p></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border bg-background/60 p-4 text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
                Run the PySpark job to populate database-backed analytics snapshots.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};
