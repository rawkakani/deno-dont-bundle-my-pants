# Authentication System

This project implements server-side authentication using cookie-based sessions with Deno.

## Overview

- **Framework**: Deno with React (server-side rendering)
- **Auth Method**: Cookie-based (`id` cookie)
- **External Login**: Redirects to environment-specific host for authentication

## Flow

1. **Server Check**: On each request, check for `id` cookie.
   - If present, authenticate user and render Dashboard.
   - If not, check for `?token=` query at `/`.

2. **Token Authentication**:
   - At `/` with `?token=<value>` and no cookie:
     - Use token as user ID.
     - Set dummy user data.
     - Set `id` cookie to token.
     - Render authenticated view.

3. **Unauthenticated**:
   - Render `AuthLoader` with looping message.
   - Client-side: Check cookie, redirect to login host with `?redirect=<full-url>` if no cookie.

4. **Logout**: `/auth/logout` clears cookie and redirects to `/`.

## Environment

- **Dev**: Redirects to `http://localhost:8000`
- **Prod**: Redirects to `https://yangu.space`

## Components

- `AuthLoader`: Displays loader, handles client-side redirects.
- `DashboardPage`: Shows user info, logout button.
- `App`: Routes based on auth state.

## Security Notes

- Cookies are HTTP-only (via auth library).
- Tokens are used directly as user IDs (dummy implementation).
- No password handling; assumes external auth service.</content>
<parameter name="filePath">/home/rawkakani/codebender/linkage/AGENTS.md