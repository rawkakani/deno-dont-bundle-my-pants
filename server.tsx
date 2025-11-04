import { renderToString } from "react-dom/server";
import { App } from "./src/app.tsx";
import { createAuth, getDefaultConfig } from "./src/auth.ts";
import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

// HTML template
const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - Linkage</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="root">{{BODY}}</div>
  <script>window.__INITIAL_DATA__ = {{INITIAL_DATA}};</script>
  <script src="client.js" type="module"></script>
</body>
</html>`;

// Function to get HTML with SSR body
function getHTML(body: string, initialData: string): string {
  return htmlTemplate.replace('{{BODY}}', body).replace('{{INITIAL_DATA}}', initialData);
}

// Static file handler
async function staticFile(path: string): Promise<Response | null> {
  try {
    const file = await Deno.readFile(path);
    const ext = path.split('.').pop() || '';
    const types: Record<string, string> = {
      'js': 'application/javascript',
      'css': 'text/css',
      'html': 'text/html',
      'mjs': 'application/javascript',
    };
    return new Response(file, {
      headers: { 
        'content-type': types[ext] || 'text/plain',
        'cache-control': 'no-cache',
      },
    });
  } catch {
    return null;
  }
}

// Bundle TypeScript/TSX to JavaScript using Deno.bundle API
async function bundleFile(filePath: string, platform: "browser" | "deno" = "browser"): Promise<string> {
  try {
    // Use the unstable Deno.bundle API (requires --unstable-bundle flag)
    const result = await (Deno as any).bundle({
      entrypoints: [filePath],
      platform,
      write: false,
    });
    
    if (!result.outputFiles || result.outputFiles.length === 0) {
      throw new Error("No output files from bundle");
    }
    
    // Get the bundled JavaScript file
    const bundledFile = result.outputFiles.find((f: any) => 
      f.path.endsWith('.js') || 
      f.path.includes(filePath)
    ) || result.outputFiles[0];
    
    if (!bundledFile) {
      throw new Error("Bundled JS file not found");
    }
    
    // Use text() if available, otherwise decode bytes
    return 'text' in bundledFile && typeof bundledFile.text === 'function' 
      ? bundledFile.text() 
      : new TextDecoder().decode(bundledFile.bytes);
  } catch (error) {
    console.error(`Error bundling ${filePath}:`, error);
    throw error;
  }
}

// Transform imports to use esm.sh URLs for browser compatibility
function transformImports(code: string): string {
  return code
    .replace(/from\s+["']react-dom\/client["']/g, 'from "https://esm.sh/react-dom@19.2.0/client"')
    .replace(/from\s+["']react-dom\/server["']/g, 'from "https://esm.sh/react-dom@19.2.0/server"')
    .replace(/from\s+["']react\/jsx-runtime["']/g, 'from "https://esm.sh/react@19.2.0/jsx-runtime"')
    .replace(/from\s+["']react["']/g, 'from "https://esm.sh/react@19.2.0"')
    .replace(/from\s+["']npm:react@[^"']+["']/g, 'from "https://esm.sh/react@19.2.0"')
    .replace(/from\s+["']npm:react\/jsx-runtime@[^"']+["']/g, 'from "https://esm.sh/react@19.2.0/jsx-runtime"')
    .replace(/from\s+["']npm:react-dom@[^"']+\/client["']/g, 'from "https://esm.sh/react-dom@19.2.0/client"')
    .replace(/from\s+["']npm:react-dom@[^"']+\/server["']/g, 'from "https://esm.sh/react-dom@19.2.0/server"')
    .replace(/from\s+["']npm:@ark-ui\/react@[^"']+["']/g, 'from "https://esm.sh/@ark-ui/react@5.27.0"')
    .replace(/from\s+["']npm:@ark-ui\/react@[^"']+\/([^"']+)["']/g, 'from "https://esm.sh/@ark-ui/react@5.27.0/$1"')
    .replace(/from\s+["']styled-system\/([^"']+)["']/g, 'from "/styled-system/$1"')
    .replace(/from\s+["'](src\/[^"']+)["']/g, 'from "/$1"')
    .replace(/from\s+["'](styled-system\/[^"']+)["']/g, 'from "/$1"')
    .replace(/export\s+\*\s+from\s+["'](src\/[^"']+)["']/g, 'export * from "/$1"')
    .replace(/export\s+\*\s+from\s+["'](styled-system\/[^"']+)["']/g, 'export * from "/$1"')
    .replace(/export\s+\*\s+as\s+(\w+)\s+from\s+["'](src\/[^"']+)["']/g, (match: string, name: string, path: string) => {
      return `export * as ${name} from "/${path}"`;
    })
    .replace(/export\s+\*\s+as\s+(\w+)\s+from\s+["'](styled-system\/[^"']+)["']/g, (match: string, name: string, path: string) => {
      return `export * as ${name} from "/${path}"`;
    })
    // Transform relative imports to absolute paths with leading slash
    .replace(/from\s+["'](\.\.?\/[^"']+\.tsx?)["']/g, (match: string, relPath: string) => {
      const currentDir = 'src'; // client.tsx is in src/
      const resolvedPath = new URL(relPath, `http://localhost/${currentDir}/`).pathname;
      const absolutePath = resolvedPath.startsWith('/') ? resolvedPath : `/${resolvedPath}`;
      return `from "${absolutePath}"`;
    });
}

// Main handler
async function handler(req: Request): Promise<Response> {
  // Load .env file
  const env = await load();

  const url = new URL(req.url);
  
  // Get auth instance for this host
  const host = url.host;
  const auth = await getAuthForHost(host);
  

  
  // Logout route
  if (auth && url.pathname === '/auth/logout') {
    return await auth.handleLogout(req);
  }

  // Zoho connect route
  if (url.pathname === '/api/zoho/connect') {
    const zohoAuthUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCalendar.event.ALL%20ZohoCalendar.calendar.ALL%20ZohoMail.messages.ALL&client_id=1000.QXU7MUQBJK1GN8P3HVT39IXCIYI2MU&response_type=code&redirect_uri=${encodeURIComponent(url.origin + '/api/zoho/callback')}&access_type=offline`;
    return Response.redirect(zohoAuthUrl);
  }

  // Zoho callback route
  if (url.pathname === '/api/zoho/callback') {
    const code = url.searchParams.get('code');
    if (code) {
      // Exchange code for tokens
      const tokenResponse = await fetch('https://accounts.zoho.com/oauth/v2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: '1000.QXU7MUQBJK1GN8P3HVT39IXCIYI2MU',
          client_secret: '48f678acc0d464c676e48183d73363de69fe2ef4d5',
          redirect_uri: url.origin + '/api/zoho/callback',
          code
        })
      });
      if (tokenResponse.ok) {
        const tokens = await tokenResponse.json();
        // Save tokens (simplified - in real app, store securely per user)
        console.log('Zoho tokens:', tokens);
        return Response.redirect('/?zoho_connected=1'); // Redirect back to dashboard with flag
      }
    }
    return new Response('OAuth failed', { status: 400 });
  }

  // Get connected Zoho accounts
  if (url.pathname === '/api/zoho/accounts') {
    // Return mock data for now
    const accounts = [
      { id: '1', email: 'user@zoho.com', scopes: ['ZohoCalendar.event.ALL', 'ZohoMail.messages.ALL'] }
    ];
    return new Response(JSON.stringify(accounts), { headers: { 'content-type': 'application/json' } });
  }

  // Static files (handle both absolute and relative paths)
  if (url.pathname === '/styles.css' || url.pathname === 'styles.css' || url.pathname.endsWith('/styles.css')) {
    return await staticFile('./dist/styles.css') || new Response('/* CSS not built */', {
      headers: { 'content-type': 'text/css' },
    });
  }
  
  // Normalize pathname to remove leading slash
  const normalizedPath = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
  
  if (normalizedPath === 'client.js' || normalizedPath.endsWith('/client.js')) {
    const file = await staticFile('./dist/client.js');
    if (file) return file;
    
    // Bundle client.tsx on-demand for dev mode
    try {
      const filePath = './src/client.tsx';
      const bundledCode = await bundleFile(filePath, "browser");
      const transformedCode = transformImports(bundledCode);
      
      return new Response(transformedCode, {
        headers: { 
          'content-type': 'application/javascript; charset=utf-8',
          'cache-control': 'no-cache',
        },
      });
    } catch (error: any) {
      return new Response(`Error bundling client.js:\n${error.message}\n${error.stack}`, { 
        status: 500,
        headers: { 'content-type': 'text/plain' },
      });
    }
  }
  
  // Serve styled-system files
  if (normalizedPath.startsWith('styled-system/')) {
    const file = await staticFile(`./${normalizedPath}`);
    if (file) return file;
    return new Response('File not found', { status: 404 });
  }
  
  // Serve TypeScript/TSX files for browser import (dev mode)
  if (normalizedPath.startsWith('src/') && (normalizedPath.endsWith('.tsx') || normalizedPath.endsWith('.ts'))) {
    try {
      const filePath = `./${normalizedPath}`;
      const bundledCode = await bundleFile(filePath, "browser");
      const transformedCode = transformImports(bundledCode);
      
      return new Response(transformedCode, {
        headers: { 
          'content-type': 'application/javascript; charset=utf-8',
          'cache-control': 'no-cache',
        },
      });
    } catch (error: any) {
      return new Response(`Error bundling ${url.pathname}:\n${error.message}\n${error.stack}`, { 
        status: 500,
        headers: { 'content-type': 'text/plain' },
      });
    }
  }
  
  // Determine redirect host based on environment
  const isProduction = Deno.env.get("NODE_ENV") === "production";
  const redirectHost = isProduction ? "https://yangu.space" : "http://localhost:8000";

  // Handle token authentication at root
  let user = null;
  let responseHeaders = new Headers();

  if (auth) {
    user = await auth.requireAuth(req);
  }

  if (!user && url.pathname === '/' && url.searchParams.has('token')) {
    const token = url.searchParams.get('token')!;
    const yanguUrl = env.yangu_url;
    if (yanguUrl) {
      try {
        const response = await fetch(yanguUrl + `/api/user`, {
          headers: { "x-userid": token }
        });
        if (response.ok) {
          const userData = await response.json();
          user = { id: token, name: userData.fullName, email: userData.emailAddress };
        } else {
          // Fallback to dummy
          user = { id: token, name: 'Authenticated User', email: 'user@example.com' };
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to dummy
        user = { id: token, name: 'Authenticated User', email: 'user@example.com' };
      }
    } else {
      // No env var, use dummy
      user = { id: token, name: 'Authenticated User', email: 'user@example.com' };
    }
    // Set cookie
    auth.setCookie(responseHeaders, "id", user.id);
  }

  if (auth && user) {
    console.log(`🔐 Authentication check for ${url.pathname}:`);
    console.log(`  - User found: ${user ? 'YES' : 'NO'}`);
    console.log(`  - User ID: ${user?.id || 'N/A'}`);
    console.log(`  - User Name: ${user?.name || 'N/A'}`);
  }

  // If user is not authenticated, show loader (except for auth routes)
  const isAuthRoute = url.pathname.startsWith('/auth/');

  // Don't redirect - let the client-side loader handle it

  // Render app with user data and current host
  const body = renderToString(<App user={user || undefined} path={url.pathname} currentHost={url.host} redirectHost={redirectHost} />);
  const initialData = JSON.stringify({ user, path: url.pathname, currentHost: url.host, redirectHost });
  const html = getHTML(body, initialData);

  // Merge headers
  const finalHeaders = new Headers({ 'content-type': 'text/html; charset=utf-8' });
  for (const [key, value] of responseHeaders.entries()) {
    finalHeaders.set(key, value);
  }

  return new Response(html, { headers: finalHeaders });
}

// Authentication cache by host
const authInstances = new Map<string, ReturnType<typeof createAuth>>();

// Get or create auth instance for specific host
async function getAuthForHost(requestHost: string) {
  if (!authInstances.has(requestHost)) {
    const config = await getDefaultConfig(requestHost);
    const auth = createAuth(config);
    authInstances.set(requestHost, auth);
  }
  return authInstances.get(requestHost)!;
}

// Start server
const port = Number(Deno.env.get("PORT")) || 8999;


Deno.serve({ port }, handler);