import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layout/app-layout";
import { LoginPage } from "@/pages/auth/login";
import { SignupPage } from "@/pages/auth/signup";
import { CalendarPage } from "@/pages/calendar";
import { DashboardPage } from "@/pages/dashboard";
import { ProjectsPage } from "@/pages/projects";
import { SettingsPage } from "@/pages/settings";
import { TeamPage } from "@/pages/team";
import { useAuthStore } from "@/store/auth-store";

const Protected = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  {
    path: "/",
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "team", element: <TeamPage /> },
      { path: "settings", element: <SettingsPage /> }
    ]
  }
]);
