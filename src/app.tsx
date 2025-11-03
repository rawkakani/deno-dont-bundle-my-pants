import { AuthLoader } from "./components/auth-loader.tsx";
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
  // If user is authenticated, show dashboard
  if (user) {
    return <DashboardPage user={user} />;
  }
  
  // Show loader while checking authentication and redirect to login
  return <AuthLoader message="Checking authentication..." />;
}