import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { AuthShell } from "./auth-shell";

const schema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8) });

export const SignupPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const onSubmit = form.handleSubmit(async (values) => {
    const response = await api.post("/auth/signup", values);
    setAuth(response.data.data.user, response.data.data.token);
    navigate("/");
  });

  return (
    <AuthShell title="Create workspace" subtitle="Start a production-grade project hub with secure auth.">
      <form onSubmit={onSubmit} className="grid gap-4">
        <Input placeholder="Full name" {...form.register("name")} />
        <Input placeholder="Email" {...form.register("email")} />
        <Input placeholder="Password" type="password" {...form.register("password")} />
        <Button disabled={form.formState.isSubmitting}>Create account</Button>
        <p className="text-center text-sm text-muted-foreground">
          Already onboard? <Link className="font-semibold text-primary" to="/login">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
};
