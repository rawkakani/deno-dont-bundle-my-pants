import { Button } from "../components/ui/button.tsx";
import { Card } from "../components/ui/card.tsx";

/**
 * Simple login page with a single login button
 * Redirects to external authentication provider
 */
export function LoginPage() {
  const handleLogin = () => {
    // Redirect to authentication provider with current full URL as redirect
    const currentUrl = window.location.href;
    window.location.href = `/auth/login?redirect=${encodeURIComponent(currentUrl)}`;
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
