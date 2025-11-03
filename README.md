# Modern SSR React Template

A production-ready Server-Side Rendered React application built with Deno, featuring authentication, modern styling, and accessible components.

## ✨ Features

- **🚀 Server-Side Rendering (SSR)** with React 19 for optimal performance
- **🎨 Modern Styling** with Panda CSS and design tokens
- **♿ Accessible Components** with Ark UI primitives
- **🔐 Complete Authentication System** with Deno KV sessions
- **⚡ On-Demand Bundling** with Deno's native bundler
- **🔒 TypeScript** for full type safety
- **📱 Responsive Design** with mobile-first approach
- **🔄 Hot Reload** in development mode

## 🚀 Quick Start

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd <project-name>
   ```

2. **Start development server:**
   ```bash
   deno task dev
   ```

3. **Open your browser:**
   Navigate to http://localhost:8999

## 🛠️ Development Commands

```bash
deno task dev      # Start dev server with hot reload
deno task build    # Build CSS for production
deno task start    # Start production server
deno task css      # Generate Panda CSS styles
```

## 🏗️ Architecture

### Core Technologies
- **Deno 2.4+** - Modern JavaScript runtime and HTTP server
- **React 19.2.0** - Latest React with SSR and concurrent features
- **Panda CSS** - Modern CSS-in-JS with design tokens and atomic CSS
- **Ark UI** - Unstyled, accessible component primitives
- **Deno KV** - Distributed key-value database for sessions

### Key Features
- **Authentication Flow**: Complete OAuth integration with subtle loading states
- **Component System**: Reusable UI components with consistent styling
- **Type Safety**: Full TypeScript coverage with strict mode
- **Performance**: On-demand bundling and atomic CSS generation
- **Accessibility**: WCAG compliant components with keyboard navigation

## 📁 Project Structure

```
├── server.tsx              # Main Deno server with SSR
├── deno.json              # Deno configuration and tasks
├── src/
│   ├── app.tsx           # Root React component
│   ├── client.tsx        # Client hydration
│   ├── pages/            # Page components
│   ├── components/       # Reusable UI components
│   └── auth.ts          # Authentication system
├── styled-system/        # Auto-generated Panda CSS output
├── scripts/             # Build and utility scripts
└── panda.config.js       # Panda CSS configuration
```

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 8999)
- `COOKIE_DOMAIN` - Cookie domain for production
- `AUTH_PROVIDER_URL` - External authentication provider

### Authentication Setup
1. Configure your auth provider URL in environment
2. Update cookie domain for production
3. Customize user data storage as needed

## 📚 Documentation

- **[agent.md](./agent.md)** - Comprehensive development guide
- **[Panda CSS Docs](https://panda-css.com/)** - Styling system documentation
- **[Ark UI Docs](https://ark-ui.com/)** - Component primitives
- **[Deno Docs](https://docs.deno.com/)** - Runtime and server documentation

## 🚀 Deployment

### Production Deployment
1. Set environment variables
2. Run `deno task build`
3. Start with `deno task start`
4. Configure reverse proxy (nginx/caddy) if needed

### Docker Support
```dockerfile
FROM denoland/deno:2.4
WORKDIR /app
COPY . .
EXPOSE 8999
CMD ["run", "--allow-net", "--allow-env", "--allow-read", "--allow-write", "server.tsx"]
```

## 🤝 Contributing

1. Follow existing code patterns and architecture
2. Update documentation for new features
3. Ensure TypeScript compliance
4. Test both SSR and client-side functionality
5. Maintain accessibility standards

## 📄 License

MIT License - feel free to use this template for your projects!

---

**Built with ❤️ using modern web technologies**