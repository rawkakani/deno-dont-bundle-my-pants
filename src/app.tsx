import { LoginPage } from "./pages/login.tsx";
import { DashboardPage } from "./pages/dashboard.tsx";

interface AppProps {
  user?: {
    id: string;
    name: string;
    email: string;
  };
  path?: string;
}

/**
 * Main app component that handles routing
 * @param user - Authenticated user data (passed from server)
 * @param path - Current path for routing
 */
export function App({ user, path }: AppProps = {}) {
  // If user is authenticated, show dashboard, otherwise show login
  if (user) {
    return <DashboardPage user={user} />;
  }
  
  return <LoginPage />;
}