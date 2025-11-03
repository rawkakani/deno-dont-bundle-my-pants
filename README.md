# Linkage

A modern Server-Side Rendered (SSR) React application built with Deno, React 18+, and Tailwind CSS, featuring island architecture support.

## Features

- ? **Fast SSR** with Deno.serve
- ?? **Panda CSS** for modern styling
- ??? **Deno KV Authentication** with session management
- ?? **React 19+** with modern hydration
- ?? **Native Bundling** using Deno
- ?? **Hot Reload** in development
- ?? **External OAuth Integration** (localhost:8000 / yangu.space)

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) 1.40+ installed (with Node.js compatibility enabled)

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd linkage
```

### Development

Start the development server with hot reload:

```bash
deno task dev
```

The server will start at `http://localhost:8999`

### Building for Production

Build all assets:

```bash
deno task build
```

This will:
- Bundle the server code
- Bundle the client code
- Build and minify CSS

### Running Production Build

```bash
deno task start
```

## Project Structure

```
linkage/
??? server.tsx              # Main Deno server
??? deno.json              # Deno configuration
??? src/
?   ??? app.tsx            # Root React component
?   ??? client.tsx         # Client hydration entry
?   ??? pages/             # Page components
?   ??? islands/           # Island components
?   ??? styles.css         # Tailwind CSS
??? scripts/               # Build scripts
??? dist/                  # Build output
```

## Available Tasks

- `deno task dev` - Start development server with watch mode
- `deno task build` - Build CSS assets for production
- `deno task start` - Start production server
- `deno run -A test-auth.ts` - Test authentication flow

## Authentication

The application includes a complete authentication system:

### Authentication Flow
1. **Login**: User clicks login button or accesses protected route → redirects to external provider with full current URL
2. **Callback**: Provider redirects back with `?token=xxx&redirect=fullUrl` → validates and creates session
3. **Session**: HTTP-only cookie stores auth token for 24 hours
4. **Protected Routes**: All routes except `/` require authentication with full URL preservation

### Environment Configuration
- **Development**: Uses `http://localhost:8000` as auth provider
- **Production**: Uses `https://yangu.space` as auth provider
- **Storage**: Deno KV with in-memory fallback

### Testing
Run authentication test suite:
```bash
deno run -A test-auth.ts
```

Test full URL redirect functionality:
```bash
deno run -A test-full-url-redirect.ts
```

## Technologies

- **Deno 2.4+** - Runtime and server framework
- **React 19.2.0** - UI library with SSR support
- **Panda CSS** - Modern CSS-in-JS with design tokens
- **Ark UI** - Accessible component primitives
- **Deno KV** - Key-value database for session storage
- **TypeScript** - Type safety

## License

MIT

## Contributing

See [agent.md](./agent.md) for detailed documentation on how to contribute and extend this project.