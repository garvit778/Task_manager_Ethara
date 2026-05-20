import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/page-transition";
import { formatDate } from "@/lib/utils";
import { useBootstrap } from "@/hooks/use-bootstrap";
import { useDataStore } from "@/store/data-store";

export const CalendarPage = () => {
  useBootstrap();
  const tasks = useDataStore((state) => state.tasks);
  const datedTasks = tasks.filter((task) => task.dueDate).sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

  return (
    <PageTransition>
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" /> Calendar view</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {datedTasks.map((task) => (
            <div key={task.id} className="rounded-lg border bg-background/60 p-4">
              <p className="text-xs font-bold uppercase text-primary">{formatDate(task.dueDate)}</p>
              <h3 className="mt-2 font-bold">{task.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{task.assignee?.name ?? "Unassigned"}</p>
              <Badge className="mt-3">{task.status.replace("_", " ")}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageTransition>
  );
};
