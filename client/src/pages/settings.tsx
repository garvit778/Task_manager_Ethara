import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { PageTransition } from "@/components/page-transition";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

export const SettingsPage = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const toast = useToast();
  const form = useForm({ defaultValues: { name: user?.name ?? "", jobTitle: user?.jobTitle ?? "", avatarUrl: user?.avatarUrl ?? "" } });

  const onSubmit = form.handleSubmit(async (values) => {
    const response = await api.patch("/users/me", values);
    setUser(response.data.data.user);
    toast.push({ title: "Profile updated", description: "Your workspace identity is fresh." });
  });

  return (
    <PageTransition>
      <Card className="glass max-w-2xl">
        <CardHeader><CardTitle>Profile settings</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <Input placeholder="Name" {...form.register("name")} />
            <Input placeholder="Job title" {...form.register("jobTitle")} />
            <Input placeholder="Avatar URL" {...form.register("avatarUrl")} />
            <Button className="w-fit">Save changes</Button>
          </form>
        </CardContent>
      </Card>
    </PageTransition>
  );
};
