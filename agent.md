# Agent Documentation

This document provides guidance for AI agents (LLMs) on how to understand, use, improve, and contribute to this codebase.

## Project Overview

This is a **Server-Side Rendered (SSR) React application** built with:
- **Deno 2.4+** as runtime and server framework with experimental bundling
- **React 19.2.0** with Server-Side Rendering (SSR) and Client-Side Hydration
- **Panda CSS** for styling (modern CSS-in-JS with design tokens)
- **Ark UI** for accessible component primitives
- **Modern bundling** using Deno's native `Deno.bundle()` API

## Architecture

### High-Level Structure

```
linkage/
├── server.tsx                    # Main Deno server with SSR and bundling
├── deno.json                    # Deno configuration, import map, and tasks
├── src/
│   ├── app.tsx                  # Root React component
│   ├── client.tsx               # Client-side hydration entry point
│   ├── pages/
│   │   └── login.tsx          # Login page component
│   ├── components/
│   │   └── ui/
│   │       ├── alert.tsx        # Alert component wrapper
│   │       ├── button.tsx       # Button component with loading states
│   │       ├── card.tsx         # Card component wrapper
│   │       ├── field.tsx        # Form field component wrapper
│   │       ├── heading.tsx      # Heading component
│   │       ├── spinner.tsx      # Loading spinner component
│   │       ├── text.tsx         # Text component
│   │       └── styled/         # Styled component primitives
│   │           ├── alert.tsx    # Styled alert with Ark UI
│   │           ├── button.tsx   # Styled button with Panda CSS
│   │           ├── card.tsx     # Styled card with Ark UI
│   │           ├── field.tsx     # Styled form field with Ark UI
│   │           ├── spinner.tsx   # Styled spinner with Panda CSS
│   │           └── utils/
│   │               └── create-style-context.tsx
│   └── styles.css              # Generated CSS from Panda CSS
├── scripts/
│   └── build-css.ts           # Panda CSS build script
├── styled-system/              # Auto-generated Panda CSS output
│   ├── css/                   # CSS function and utilities
│   ├── jsx/                   # JSX components (Stack, Center, etc.)
│   ├── patterns/               # Layout patterns
│   ├── recipes/                # Component recipes (button, card, etc.)
│   ├── tokens/                 # Design tokens
│   └── types/                 # TypeScript definitions
├── panda.config.js             # Panda CSS configuration
├── agent.md                   # This file
└── README.md
```

### Key Architectural Decisions

1. **Deno.serve for HTTP Server**
   - Uses Deno's native `Deno.serve` API (modern Web Standard)
   - Handles SSR, static file serving, and on-demand bundling
   - Uses experimental `--unstable-bundle` flag for `Deno.bundle()` API
   - Reference: https://docs.deno.com/runtime/reference/bundling/

2. **SSR with React 19**
   - Server renders React components using `renderToString` from `react-dom/server`
   - Client hydrates using `hydrateRoot` from `react-dom/client`
   - Full HTML sent on initial request for better SEO and performance
   - Fixed hydration issues by ensuring valid HTML nesting

3. **On-Demand Bundling**
   - Server uses `Deno.bundle()` runtime API to transform TSX/JSX to JavaScript
   - No build step required for development
   - Automatic import transformation to esm.sh URLs for browser compatibility
   - Supports both individual files and component libraries

4. **Panda CSS for Styling**
   - Modern CSS-in-JS with design tokens and recipes
   - Generates atomic CSS classes for optimal performance
   - Component recipes for consistent styling (button, card, field, etc.)
   - JSX components for layout patterns (Stack, Center, etc.)
   - Reference: https://panda-css.com/

5. **Ark UI for Accessibility**
   - Provides accessible component primitives
   - Used for: Field (form inputs), Card, Alert components
   - Headless components with full keyboard navigation and ARIA support
   - Reference: https://ark-ui.com/

## Dependencies

### Core Dependencies
- **React 19.2.0**: UI library with JSX transform
- **React DOM 19.2.0**: Server and client rendering
- **@ark-ui/react 5.27.0**: Accessible component primitives
  - `@ark-ui/react/factory`: For creating styled components
  - `@ark-ui/react/field`: For form field accessibility

### Styled System (Panda CSS)
- **styled-system/jsx**: JSX components (Stack, Center, styled function)
- **styled-system/css**: CSS function for styling
- **styled-system/recipes**: Component recipes (button, card, field, etc.)
- **styled-system/types**: TypeScript definitions

### Development Tools
- **Panda CSS**: CSS-in-JS styling and build system
- **Deno 2.4+**: Runtime, server, and bundling

## Development Workflow

### Getting Started

1. **Development Mode** (with hot reload):
   ```bash
   deno task dev
   ```
   This:
   - Builds CSS using Panda CSS
   - Starts server with `--watch` flag for automatic reloading
   - Uses `--unstable-bundle` for on-demand bundling

2. **Build for Production**:
   ```bash
   deno task build
   ```
   This builds CSS only (server bundles on-demand)

3. **Start Production Server**:
   ```bash
   deno task start
   ```
   Runs server without watch mode.

### File Modification Guidelines

#### Adding a New Page

1. Create component in `src/pages/your-page.tsx`
2. Export a named component: `export function YourPage()`
3. Add routing logic in `server.tsx` handler function
4. Update `src/app.tsx` if using a single-page app approach

#### Adding UI Components

1. Create styled primitive in `src/components/ui/styled/your-component.tsx`:
   ```tsx
   import { ark } from "@ark-ui/react/factory";
   import { yourRecipe } from "styled-system/recipes";
   import { createStyleContext } from "styled-system/jsx";
   
   const { withProvider, withContext } = createStyleContext(yourRecipe);
   export const Root = withProvider(ark.div, "root");
   export const Title = withContext(ark.h3, "title");
   ```

2. Create wrapper in `src/components/ui/your-component.tsx`:
   ```tsx
   export * as YourComponent from "./styled/your-component.tsx";
   ```

3. Add recipe to Panda CSS config if needed

#### Modifying Styles

1. Edit `panda.config.js` for design tokens and global configuration
2. Use styled-system JSX components (`Stack`, `Center`, etc.) for layout
3. Use styled function for custom styled components
4. Run `deno task css` to rebuild CSS (automatic in dev)

#### Adding Dependencies

1. Add to `deno.json` under `imports`:
   ```json
   "imports": {
     "package-name": "npm:package-name@version"
   }
   ```

2. Use npm: prefix for npm packages (Deno will resolve via esm.sh)
3. Update server.tsx transformImports function to handle new dependencies

## Code Patterns

### Server-Side Rendering

```tsx
// server.tsx
import { renderToString } from "react-dom/server";
import { App } from "./src/app.tsx";

const body = renderToString(<App />);
const html = getHTML(body);
return new Response(html, {
  headers: { 'content-type': 'text/html; charset=utf-8' },
});
```

### Client-Side Hydration

```tsx
// src/client.tsx
import { hydrateRoot } from "react-dom/client";
import { App } from "./app.tsx";

const rootElement = document.getElementById("root");
if (rootElement) {
  hydrateRoot(rootElement, <App />);
}
```

### Styled Component Pattern

```tsx
// src/components/ui/styled/example.tsx
import { ark } from "@ark-ui/react/factory";
import { exampleRecipe } from "styled-system/recipes";
import { createStyleContext } from "styled-system/jsx";

const { withProvider, withContext } = createStyleContext(exampleRecipe);

export const Root = withProvider(ark.div, "root");
export const Title = withContext(ark.h3, "title");
export const Content = withContext(ark.div, "content");
```

### Component Wrapper Pattern

```tsx
// src/components/ui/example.tsx
export * as Example from "./styled/example.tsx";
```

### Form Handling (SSR-friendly)

```tsx
// Use controlled components with useState
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);
  // Handle API call
  setIsLoading(false);
};
```

### Panda CSS Styling

```tsx
// Using JSX components
import { Stack, Center, styled } from "styled-system/jsx";

// Layout components
<Stack gap="4" direction="column">
  <Center>Content</Center>
</Stack>

// Styled components
const StyledDiv = styled("div", {
  base: { bg: "blue.500", color: "white" },
  responsive: { md: { bg: "red.500" } }
});
```

## Server Implementation Details

### Request Handling

The server handles multiple request types:

1. **Static CSS**: `/styles.css` → serves generated CSS
2. **Client Bundle**: `/client.js` → bundles and serves client.tsx on-demand
3. **Source Files**: `/src/*` → bundles and serves TSX/TS files on-demand
4. **Styled System**: `/styled-system/*` → serves generated styled-system files
5. **SSR**: All other routes → server-rendered React HTML

### On-Demand Bundling

```tsx
// Bundle TypeScript/TSX to JavaScript
async function bundleFile(filePath: string): Promise<string> {
  const result = await (Deno as any).bundle({
    entrypoints: [filePath],
    platform: "browser",
    write: false,
  });
  
  const bundledFile = result.outputFiles[0];
  return bundledFile.text();
}
```

### Import Transformation

The server automatically transforms imports for browser compatibility:

```tsx
// Transforms npm imports to esm.sh URLs
.replace(/from\s+["']react["']/g, 'from "https://esm.sh/react@19.2.0"')
.replace(/from\s+["']@ark-ui\/react["']/g, 'from "https://esm.sh/@ark-ui/react@5.27.0"')
// ... more transformations
```

## Common Tasks

### Authentication System

The application uses **Deno KV** for session management with external OAuth provider integration:

#### Authentication Flow

1. **Login Initiation** (`/auth/login`):
   - User clicks login button or accesses protected route
   - Server captures current full URL (including path and query params)
   - Redirects to external auth provider (localhost:8000 or yangu.space)
   - Passes complete `redirect` URL for post-auth return

2. **Authentication Callback** (`/auth/callback`):
   - External provider redirects back with `?token=xxx&redirect=fullUrl`
   - Server validates token with external API
   - Creates user session in Deno KV
   - Sets HTTP-only auth cookie
   - Redirects to exact original URL (preserves path and query parameters)

3. **Session Validation**:
   - Protected routes validate auth token cookie
   - Sessions expire after 24 hours (configurable)
   - Automatic cleanup of expired sessions
   - Unauthenticated users redirected to login with current URL preserved

#### Key Components

- **`src/auth.ts`**: Complete authentication system with Deno KV
- **`src/pages/login.tsx`**: Simple login page with single button
- **`server.tsx`**: Auth routes and middleware

#### Authentication Routes

- `GET /auth/login` - Redirect to external provider
- `GET /auth/callback?token=xxx&redirect=/path` - Handle auth callback
- `GET /auth/logout` - Clear session and redirect

#### Environment Configuration

- **Development**: Uses `http://localhost:8000` as auth provider
- **Production**: Uses `https://yangu.space` as auth provider
- **Cookie Settings**: HTTP-only, secure in production, 24-hour expiry

#### Protected Routes

Any route other than `/` requires authentication. Unauthenticated users are redirected to login with their current full URL preserved in the redirect parameter, ensuring they return to exactly where they started after authentication.

#### User Data Storage

- Users stored in KV under `["user", userId]`
- Sessions stored in KV under `["session", token]`
- Mock user API for development (replace with real API)

### Adding Routing

Simple path-based routing in `server.tsx`:
```tsx
const url = new URL(req.url);
if (url.pathname === "/login") {
  // Render login page
} else if (url.pathname === "/dashboard") {
  // Render dashboard
}
```

### Adding API Endpoints

Add handlers in `server.tsx` before SSR handling:
```tsx
if (url.pathname.startsWith("/api/")) {
  // Handle API request
  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
  });
}
```

### Optimizing Performance

1. **Code Splitting**: On-demand bundling automatically splits by file
2. **CSS**: Panda CSS generates atomic CSS, purges unused styles
3. **Bundle Size**: Monitor client bundle size in browser dev tools
4. **Caching**: Server sets appropriate cache headers for static assets

## Best Practices

1. **Type Safety**: Use TypeScript strictly (configured in `deno.json`)
2. **Imports**: Use import map in `deno.json`, avoid relative imports for packages
3. **Error Handling**: Handle errors gracefully in both SSR and client
4. **Accessibility**: Use Ark UI components for built-in accessibility
5. **Performance**: 
   - Leverage on-demand bundling
   - Use Panda CSS for optimal CSS generation
   - Monitor bundle sizes
6. **Security**: 
   - Sanitize user input
   - Use HTTPS in production
   - Validate API inputs
   - React handles XSS protection by default

## Troubleshooting

### Build Errors

- **CSS not building**: Run `deno task css` to rebuild Panda CSS
- **Bundle errors**: Check `--unstable-bundle` flag is present
- **Type errors**: Run `deno check` to see TypeScript errors

### Runtime Errors

- **Hydration mismatch**: Ensure SSR and client render same initial HTML
- **Module not found**: Check import map in `deno.json` and server transformation
- **CORS issues**: Add appropriate headers in `server.tsx`

### Development Issues

- **Server not reloading**: Ensure `--watch` flag is used in dev task
- **Styles not updating**: Panda CSS should rebuild automatically
- **Port in use**: Change PORT env variable or update `server.tsx`

## Contributing Guidelines

When making changes:

1. **Follow existing patterns**: Match code style and architecture
2. **Update this doc**: If adding new patterns or changing architecture
3. **Test thoroughly**: Ensure SSR and hydration work correctly
4. **Consider performance**: Keep bundles small, use on-demand bundling
5. **Document complex logic**: Add comments for non-obvious code

## Future Improvements

Potential enhancements:

1. **Router**: Add proper client-side routing (e.g., with Hono or custom)
2. **State Management**: Add Zustand, Jotai, or similar for global state
3. **API Layer**: Create structured API handling (middleware, validation)
4. **Testing**: Add unit and integration tests with Deno.test()
5. **CI/CD**: Add GitHub Actions for builds and deployments
6. **Error Boundaries**: Add React error boundaries
7. **SEO**: Add meta tags, structured data, sitemap
8. **PWA**: Add service worker and manifest for offline support

## Resources

- Deno Docs: https://docs.deno.com/
- Deno Bundling: https://docs.deno.com/runtime/reference/bundling/
- React 19: https://react.dev/
- Panda CSS: https://panda-css.com/
- Ark UI: https://ark-ui.com/
- JSX Runtime: https://esm.sh/

---

**Last Updated**: December 2024
**Maintainer**: See repository for current maintainer