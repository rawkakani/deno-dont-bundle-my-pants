import { Button } from "../components/ui/button.tsx";
import { Card } from "../components/ui/card.tsx";
import { Text } from "../components/ui/text.tsx";

interface DashboardPageProps {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Dashboard page shown after successful authentication
 * @param user - Authenticated user data
 */
export function DashboardPage({ user }: DashboardPageProps) {
  const handleLogout = () => {
    window.location.href = "/auth/logout";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        backgroundColor: "#f9fafb",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "2rem"
        }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
              Dashboard
            </h1>
            <p style={{ color: "#6b7280", margin: "0.5rem 0 0 0" }}>
              Welcome back, {user?.name || "User"}
            </p>
          </div>
          <Button onClick={handleLogout} colorPalette="red">
            Logout
          </Button>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          gap: "1.5rem" 
        }}>
          <Card.Root>
            <Card.Header>
              <Card.Title>User Profile</Card.Title>
            </Card.Header>
            <Card.Body>
              <Text size="sm" color="fg.muted">
                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>Name:</strong> {user?.name || "N/A"}
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>Email:</strong> {user?.email || "N/A"}
                </div>
                <div>
                  <strong>ID:</strong> {user?.id || "N/A"}
                </div>
              </Text>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Card.Title>Authentication Status</Card.Title>
            </Card.Header>
            <Card.Body>
              <Text size="sm" color="fg.muted">
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem",
                  marginBottom: "0.5rem" 
                }}>
                  <div style={{ 
                    width: "8px", 
                    height: "8px", 
                    borderRadius: "50%", 
                    backgroundColor: "#10b981" 
                  }} />
                  Authenticated
                </div>
                <div>
                  Session is active and valid
                </div>
              </Text>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Card.Title>Quick Actions</Card.Title>
            </Card.Header>
            <Card.Body>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <Button variant="outline" size="sm">
                  View Settings
                </Button>
                <Button variant="outline" size="sm">
                  Manage Account
                </Button>
              </div>
            </Card.Body>
          </Card.Root>
        </div>
      </div>
    </div>
  );
}