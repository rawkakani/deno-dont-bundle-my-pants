import { useState } from "react";
import { Stack } from "styled-system/jsx";
import { Alert } from "../components/ui/alert.tsx";
import { Button } from "../components/ui/button.tsx";
import { Card } from "../components/ui/card.tsx";
import { Field } from "../components/ui/field.tsx";
import { Text } from "../components/ui/text.tsx";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // TODO: Implement actual authentication
    console.log("Login attempt:", { email, password });
    setError("Authentication not yet implemented");
    setIsLoading(false);
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
            Welcome back
          </Card.Title>
          <Card.Description>
            <Text size="sm" color="fg.muted">
              Sign in to continue
            </Text>
          </Card.Description>
        </Card.Header>

        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Stack gap="5">
              {error && (
                <Alert.Root status="error">
                  <Alert.Title>{error}</Alert.Title>
                </Alert.Root>
              )}

              <Field.Root>
                <Field.Label>Email</Field.Label>
                <Field.Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Password</Field.Label>
                <Field.Input
                  type="password"
                  placeholder="????????"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </Field.Root>

              <Button
                type="submit"
                loading={isLoading}
                loadingText="Signing in..."
                width="full"
                colorPalette="blue"
                size="lg"
              >
                Sign in
              </Button>
            </Stack>
          </form>
        </Card.Body>

        <Card.Footer justifyContent="center">
          <Text size="sm" color="fg.muted">
            Don't have an account?{" "}
            <a href="#" style={{ fontWeight: "500", color: "inherit" }}>
              Sign up
            </a>
          </Text>
        </Card.Footer>
      </Card.Root>
    </div>
  );
}
