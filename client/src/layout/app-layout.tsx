import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Bell, CalendarDays, KanbanSquare, LogOut, Moon, Plus, Settings, Sun, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToastProvider } from "@/components/ui/toast";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";

const nav = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/projects", label: "Projects", icon: KanbanSquare },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/team", label: "Team", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings }
];

export const AppLayout = () => {
  const { user, logout } = useAuthStore();
  const { darkMode, toggleTheme } = useUiStore();
  const navigate = useNavigate();

  return (
    <ToastProvider>
      <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.13),transparent_30%)]">
        <aside className="fixed left-4 top-4 z-40 hidden h-[calc(100vh-2rem)] w-64 rounded-lg border bg-card/80 p-4 shadow-glow backdrop-blur-xl lg:block">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-primary text-lg font-black text-primary-foreground">P</div>
            <div>
              <p className="text-sm font-bold">ProjectPilot</p>
              <p className="text-xs text-muted-foreground">Launch work faster</p>
            </div>
          </div>
          <nav className="mt-8 grid gap-2">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-secondary p-4">
            <p className="text-sm font-semibold">Sprint velocity</p>
            <p className="mt-1 text-xs text-muted-foreground">Live updates enabled with Socket.io.</p>
            <Button onClick={() => navigate("/projects")} className="mt-4 w-full" size="sm">
              <Plus className="h-4 w-4" /> New work
            </Button>
          </div>
        </aside>

        <main className="lg:pl-72">
          <header className="sticky top-0 z-30 border-b bg-background/76 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
                <p className="text-xs font-semibold uppercase text-primary">Workspace</p>
                <h1 className="text-xl font-bold sm:text-2xl">Good to see you, {user?.name?.split(" ")[0] ?? "there"}</h1>
              </motion.div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              </div>
            </div>
          </header>
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </ToastProvider>
  );
};
