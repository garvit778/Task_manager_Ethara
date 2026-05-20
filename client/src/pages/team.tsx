import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTransition } from "@/components/page-transition";
import { useBootstrap } from "@/hooks/use-bootstrap";
import { useDataStore } from "@/store/data-store";

export const TeamPage = () => {
  useBootstrap();
  const users = useDataStore((state) => state.users);

  return (
    <PageTransition>
      <Card className="glass">
        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Team directory</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => (
            <div key={user.id} className="rounded-lg border bg-background/60 p-4">
              <div className="flex items-center gap-3">
                <img src={user.avatarUrl ?? `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`} alt="" className="h-12 w-12 rounded-md object-cover" />
                <div>
                  <h3 className="font-bold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.jobTitle ?? user.role}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{user.email}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageTransition>
  );
};
