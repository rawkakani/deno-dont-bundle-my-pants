import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button.tsx";
import { css } from "styled-system/css";

interface DashboardPageProps {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface ZohoAccount {
  id: string;
  email: string;
  scopes: string[];
}

/**
 * Dashboard page shown after successful authentication
 * @param user - Authenticated user data
 */
export function DashboardPage({ user }: DashboardPageProps) {
  const [connectedAccounts, setConnectedAccounts] = useState<ZohoAccount[]>([]);

  useEffect(() => {
    // Fetch connected Zoho accounts
    fetchConnectedAccounts();

    // Check if redirected from Zoho connection
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('zoho_connected')) {
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
      // Refresh accounts
      fetchConnectedAccounts();
    }
  }, []);

  const fetchConnectedAccounts = async () => {
    try {
      const response = await fetch('/api/zoho/accounts');
      if (response.ok) {
        const accounts = await response.json();
        setConnectedAccounts(accounts);
      }
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
    }
  };

  const handleConnectZoho = () => {
    // Redirect to Zoho OAuth
    window.location.href = '/api/zoho/connect';
  };

  const handleLogout = () => {
    window.location.href = "/auth/logout";
  };

  return (
    <div className={css({ minHeight: "100vh", padding: "2rem", backgroundColor: "gray.50" })}>
      <div className={css({ maxWidth: "1200px", margin: "0 auto" })}>
        {/* Top Bar */}
        <div className={css({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          padding: "1rem",
          backgroundColor: "white",
          borderRadius: "md",
          boxShadow: "sm"
        })}>
          <h1 className={css({ fontSize: "2xl", fontWeight: "bold", margin: 0 })}>
            Welcome {user?.name || "User"}
          </h1>
          <Button onClick={handleLogout} colorPalette="red">
            Logout
          </Button>
        </div>

        {/* Connected Zoho Accounts */}
        <div className={css({
          display: "grid",
          gridTemplateColumns: { base: "1fr", md: "repeat(auto-fit, minmax(300px, 1fr))" },
          gap: "1.5rem"
        })}>
          {/* Connect Zoho Card */}
          <div className={css({
            backgroundColor: "white",
            borderRadius: "md",
            boxShadow: "sm",
            padding: "1.5rem"
          })}>
            <h3 className={css({ fontSize: "lg", fontWeight: "semibold", marginBottom: "1rem" })}>
              Connect to Zoho
            </h3>
            <Button onClick={handleConnectZoho} size="lg">
              Connect Zoho Account
            </Button>
          </div>

          {/* Connected Accounts */}
          {connectedAccounts.map((account) => (
            <div key={account.id} className={css({
              backgroundColor: "white",
              borderRadius: "md",
              boxShadow: "sm",
              padding: "1.5rem"
            })}>
              <h3 className={css({ fontSize: "lg", fontWeight: "semibold", marginBottom: "1rem" })}>
                Zoho Account
              </h3>
              <div className={css({ fontSize: "sm", color: "gray.600" })}>
                <div className={css({ marginBottom: "0.5rem" })}>
                  <strong>Email:</strong> {account.email}
                </div>
                <div>
                  <strong>Scopes:</strong> {account.scopes.join(", ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}