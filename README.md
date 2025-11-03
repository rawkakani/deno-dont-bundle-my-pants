# Linkage

A modern Server-Side Rendered (SSR) React application built with Deno, React 18+, and Tailwind CSS, featuring island architecture support.

## Features

- ? **Fast SSR** with Deno.serve
- ?? **Tailwind CSS** for styling
- ??? **Island Architecture** for selective hydration
- ?? **React 18+** with modern hydration
- ?? **Native Bundling** using Deno
- ?? **Hot Reload** in development

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
- `deno task build` - Build all assets for production
- `deno task bundle` - Bundle server and client code
- `deno task bundle:server` - Bundle server code only
- `deno task bundle:client` - Bundle client code only
- `deno task build:css` - Build CSS with Tailwind
- `deno task start` - Start production server

## Technologies

- **Deno** - Runtime and server framework
- **React 18+** - UI library with SSR support
- **Tailwind CSS 4.1** - Utility-first CSS framework (via PostCSS)
- **TypeScript** - Type safety

## License

MIT

## Contributing

See [agent.md](./agent.md) for detailed documentation on how to contribute and extend this project.