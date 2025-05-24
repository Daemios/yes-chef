# Yes Chef - Monorepo Structure

This project has been restructured as a proper npm workspace monorepo.

## Project Structure

```
yes-chef/                    # Root workspace
├── package.json            # Workspace configuration
├── client/                 # Vue.js frontend
│   ├── package.json        # Client dependencies
│   ├── node_modules/       # Client-specific modules
│   └── src/               # Client source code
├── server/                 # Express.js backend
│   ├── package.json        # Server dependencies  
│   ├── node_modules/       # Server-specific modules
│   └── src/               # Server source code
└── shared/                 # Shared code and types
```

## Development Commands

### Root Level (Preferred)
```bash
npm run dev                 # Start both client and server
npm run build              # Build both client and server
npm run test               # Run tests for both
npm run lint               # Lint both codebases
```

### Individual Workspaces
```bash
# Client commands
cd client
npm run dev                # Start Vite dev server
npm run build              # Build for production
npm run test               # Run client tests

# Server commands  
cd server
npm run dev                # Start Express server with nodemon
npm run build              # Build TypeScript
npm run test               # Run server tests
npm run db:generate        # Generate Prisma client
npm run db:migrate         # Run database migrations
```

## Installation

```bash
npm install                # Installs all workspace dependencies
```

## Database Setup

Before running the server for the first time:

```bash
cd server
npm run db:generate        # Generate Prisma client
npm run db:migrate         # Apply database migrations
```

## Benefits of This Structure

✅ **Clear separation** - Each package has its own dependencies  
✅ **Better caching** - CI/CD can cache client/server deps separately  
✅ **Easier deployment** - Can build/deploy independently  
✅ **Standard practice** - Follows npm workspaces conventions  
✅ **Type safety** - Shared types properly referenced

## Migration Notes

- Root `node_modules` now only contains workspace management tools
- Client and server have their own `node_modules` directories
- Shared dependencies are automatically hoisted when possible
- Scripts updated to work with workspace structure
