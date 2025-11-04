/// <reference types="npm:@types/react" />

import React from "react";

interface LoaderProps {
  message?: string;
  redirectHost: string;
}

/**
 * Authentication loader component with pulsing circle
 */
export function AuthLoader({ message = "Just a moment...", redirectHost }: LoaderProps) {
  const script = `
    // Check if user is authenticated by looking for id cookie
    function getCookie(name) {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) return value;
      }
      return null;
    }

    // Looping funny and heartfelt messages
    const messages = ["Hey!", "How you doing?", "We are here", "Are you ready?"];
    let messageIndex = 0;
    setInterval(() => {
      const el = document.getElementById('loading-message');
      if (el) {
        el.textContent = messages[messageIndex];
        messageIndex = (messageIndex + 1) % messages.length;
      }
    }, 1500); // Change every 1.5 seconds

    const userId = getCookie('id');
    if (!userId) {
      // Not authenticated, redirect to login after showing loader briefly
      setTimeout(() => {
        const currentUrl = window.location.href;
        const loginUrl = '${redirectHost}?redirect=' + encodeURIComponent(currentUrl);
        window.location.href = loginUrl;
      }, 1500); // Show loader for 1.5 seconds
    } else {
      // Authenticated, reload to get user data from server
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Brief loader then reload
    }
  `;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
      }}>
        {/* Pulsing circle loader */}
        <div style={{
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          opacity: 0.8,
          animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}></div>

        {/* Loading message */}
        <p id="loading-message" style={{
          color: '#6b7280',
          fontSize: '0.875rem',
          margin: 0,
          textAlign: 'center',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}>Hey</p>
      </div>

      {/* Client-side redirect script */}
      <script>{script}</script>
    </div>
  );
}