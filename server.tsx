import { renderToString } from "react-dom/server";
import { App } from "./src/app.tsx";

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
  <script src="client.js" type="module"></script>
</body>
</html>`;

// Function to get HTML with SSR body
function getHTML(body: string): string {
  return htmlTemplate.replace('{{BODY}}', body);
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
  const url = new URL(req.url);
  
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
  
  // SSR - render and return HTML
  const body = renderToString(<App />);
  const html = getHTML(body);
  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

// Start server
const port = Number(Deno.env.get("PORT")) || 8999;
console.log(`🚀 Server running at http://localhost:${port}`);
Deno.serve({ port }, handler);