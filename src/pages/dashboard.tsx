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
    <div className={css({
      minHeight: "100vh",
      backgroundColor: "background",
      display: "flex",
      flexDirection: "column"
    })}>
      <div className={css({ maxWidth: "1200px", margin: "0 auto", padding: "2rem", flex: 1, display: "flex", flexDirection: "column" })}>
        {/* Top Bar */}
        <div className={css({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          padding: "1rem",
          backgroundColor: "background",
          borderBottom: "1px solid",
          borderColor: "border"
        })}>
          <h1 className={css({ fontSize: { base: "xl", md: "2xl" }, fontWeight: "bold", margin: 0, color: "foreground" })}>
            Welcome {user?.name || "User"}
          </h1>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Logout
          </Button>
        </div>

        {/* Connected Zoho Accounts */}
        <div className={css({
          display: "grid",
          gridTemplateColumns: { base: "1fr", md: "repeat(auto-fit, minmax(350px, 1fr))" },
          gap: "1.5rem",
          flex: 1,
          marginBottom: { base: "5rem", md: "2rem" } // Space for fixed button on mobile
        })}>
          {/* Connected Accounts */}
          {connectedAccounts.map((account) => (
            <div key={account.id} className={css({
              backgroundColor: "card",
              borderRadius: "lg",
              border: "1px solid",
              borderColor: "border",
              boxShadow: "sm",
              padding: "1.5rem"
            })}>
              <h3 className={css({ fontSize: "lg", fontWeight: "semibold", marginBottom: "1rem", color: "card.foreground" })}>
                Zoho Account
              </h3>
              <div className={css({ fontSize: "sm", color: "muted.foreground" })}>
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

        {/* Connect Zoho Button - Fixed at bottom on mobile */}
        <div className={css({
          position: { base: "fixed", md: "static" },
          bottom: { base: 0, md: "auto" },
          left: { base: 0, md: "auto" },
          right: { base: 0, md: "auto" },
          padding: { base: "1rem", md: 0 },
          backgroundColor: { base: "background", md: "transparent" },
          borderTop: { base: "1px solid", md: "none" },
          borderColor: { base: "border", md: "transparent" }
        })}>
          <Button onClick={handleConnectZoho} className={css({ width: { base: "full", md: "auto" } })} size="lg">
            Connect Zoho Account
          </Button>
        </div>
      </div>
    </div>
  );
}