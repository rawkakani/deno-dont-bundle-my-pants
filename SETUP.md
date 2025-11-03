# Template Setup Guide

This is a **Modern SSR React Template** built with Deno. Follow these steps to customize for your project.

## 🚀 Quick Setup

### 1. Update Project Info
Edit `deno.json` and update:
- Project name in README.md
- Any specific dependencies you need

### 2. Configure Authentication
Edit `src/auth.ts`:
- Update `AUTH_PROVIDER_URL` to your auth service
- Customize user data handling
- Adjust session duration if needed

### 3. Customize Styling
Edit `panda.config.js`:
- Modify design tokens (colors, spacing, etc.)
- Add or adjust component recipes
- Update theme configuration

### 4. Add Your Pages
Create new pages in `src/pages/`:
```tsx
export function YourPage() {
  return <div>Your Content</div>;
}
```

Add routing in `server.tsx`:
```tsx
if (url.pathname === "/your-page") {
  const body = renderToString(<YourPage />);
  return new Response(getHTML(body), {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
```

## 🔧 Common Customizations

### Change Auth Provider
```tsx
// src/auth.ts
const AUTH_PROVIDER_URL = "https://your-auth-service.com";
```

### Update Styling Theme
```js
// panda.config.js
theme: {
  extend: {
    tokens: {
      colors: {
        brand: {
          50: "#your-color",
          // ... more colors
        }
      }
    }
  }
}
```

### Add New Components
1. Create styled primitive in `src/components/ui/styled/`
2. Create wrapper in `src/components/ui/`
3. Export and use in your pages

## 📦 Deployment

### Environment Variables
Set these for production:
- `PORT=8999`
- `COOKIE_DOMAIN=yourdomain.com`
- `AUTH_PROVIDER_URL=https://your-auth.com`

### Docker Deployment
```dockerfile
FROM denoland/deno:2.4
WORKDIR /app
COPY . .
EXPOSE 8999
CMD ["run", "--allow-net", "--allow-env", "--allow-read", "--allow-write", "server.tsx"]
```

### Start Production
```bash
deno task build  # Build CSS
deno task start  # Start server
```

## 🏗️ Architecture Notes

- **SSR**: Server renders React, client hydrates
- **Bundling**: On-demand with Deno.bundle()
- **Styling**: Panda CSS with atomic classes
- **Auth**: Cookie-based sessions with Deno KV
- **Components**: Ark UI primitives + custom styling

## 📚 Documentation

- See README.md for overview
- Check inline code comments for details
- Refer to Panda CSS and Ark UI docs

---

**Ready to build your next web application!** 🚀