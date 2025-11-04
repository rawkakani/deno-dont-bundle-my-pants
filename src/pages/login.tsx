import { Button } from "../components/ui/button.tsx";
import { Card } from "../components/ui/card.tsx";

/**
 * Simple login page with a single login button
 * Redirects to external authentication provider
 */
interface LoginPageProps {
  currentHost?: string;
}

export function LoginPage({ currentHost }: LoginPageProps = {}) {
  // Get redirect parameter from URL, default to '/'
  // Handle SSR where globalThis.location might be undefined
  let redirectPath = '/';
  try {
    if (globalThis.location?.search) {
      const urlParams = new URLSearchParams(globalThis.location.search);
      redirectPath = urlParams.get('redirect') || '/';
    }
  } catch {
    // Fallback to default redirect during SSR
    redirectPath = '/';
  }
  
  // Build full redirect URL (host + path)
  // Use currentHost from props if available, otherwise use current origin
  const redirectUrl = globalThis.location ? 
    `${currentHost ? `https://${currentHost}` : globalThis.location.origin}${redirectPath}` : 
    redirectPath;
  
  const handleLogin = async () => {
    if (typeof window !== 'undefined') {
      // Show loading state
      const button = document.querySelector('button');
      if (button) {
        button.textContent = 'Logging in...';
        button.disabled = true;
      }
      
      // Simulate word-by-word delay (2 seconds per word for reading time)
      const words = ['Preparing', 'your', 'magical', 'journey'];
      for (const word of words) {
        if (button) {
          button.textContent = `${word}...`;
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Redirect to authentication provider with the full redirect URL
      window.location.href = `/auth/login?redirect=${encodeURIComponent(redirectUrl)}`;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        backgroundColor: "#f9fafb",
      }}
    >
      <Card.Root maxW="sm" width="full">
        <Card.Header>
          <Card.Title>
            Welcome
          </Card.Title>
        </Card.Header>

        <Card.Body>
          <Button
            onClick={handleLogin}
            width="full"
            colorPalette="blue"
            size="lg"
          >
            Login
          </Button>
        </Card.Body>
      </Card.Root>
    </div>
  );
}
