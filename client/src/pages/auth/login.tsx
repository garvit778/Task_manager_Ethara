import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { AuthShell } from "./auth-shell";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: "admin@projectpilot.dev", password: "Password123!" } });

  const onSubmit = form.handleSubmit(async (values) => {
    const response = await api.post("/auth/login", values);
    setAuth(response.data.data.user, response.data.data.token);
    navigate("/");
  });

  return (
    <AuthShell title="Welcome back" subtitle="Use the seeded admin account after running the seed script.">
      <form onSubmit={onSubmit} className="grid gap-4">
        <Input placeholder="Email" {...form.register("email")} />
        <Input placeholder="Password" type="password" {...form.register("password")} />
        <Button disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Signing in..." : "Sign in"}</Button>
        <p className="text-center text-sm text-muted-foreground">
          New here? <Link className="font-semibold text-primary" to="/signup">Create account</Link>
        </p>
      </form>
    </AuthShell>
  );
};
