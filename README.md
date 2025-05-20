# Yes Chef

A modern full-stack application built with Vue.js, Node.js, Express, and TypeScript.

## 🚀 Project Structure

```
yes-chef/
├── client/                 # Vue.js frontend
│   ├── public/             # Static assets
│   ├── src/                # Source files
│   │   ├── assets/         # Images, fonts, etc.
│   │   ├── components/     # Reusable Vue components
│   │   ├── router/         # Vue router configuration
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript type definitions
│   │   ├── views/          # Page components
│   │   ├── App.vue         # Main app component
│   │   └── main.ts         # Entry point
│   ├── tests/              # Legacy tests location
│   ├── index.html          # HTML template
│   ├── tsconfig.json       # TypeScript config for client
│   ├── vite.config.ts      # Vite configuration
│   └── vitest.config.ts    # Vitest configuration for client tests
│
├── server/                 # Express backend
│   ├── src/                # Source files
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Entry point
│   ├── tests/              # Additional server tests
│   ├── vitest.config.ts    # Vitest configuration for server
│   └── tsconfig.json       # TypeScript config for server
│
├── config/                 # Project configuration files
│
├── dist/                   # Compiled output (not in repository)
│   ├── client/             # Built client files
│   └── server/             # Built server files
│
└── node_modules/           # Dependencies (not in repository)
```

## 🛠️ Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start both frontend and backend in development mode
npm run dev

# Start only the backend server
npm run dev:server

# Start only the frontend server
npm run dev:client
```

### Building for Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Testing

```bash
# Run all tests
npm test

# Run server tests only
npm run test:server

# Run client tests only
npm run test:client

# Run Vitest (alternative test framework for client)
npm run vitest

# Run tests
npm test

# Run client tests only
npm run test:client

# Run server tests only
npm run test:server

# Run Vitest in watch mode
npm run test:watch

# Run Vitest with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 🧪 Testing Framework

This project uses **Vitest** as the unified testing framework for both frontend and backend:

- Fast, Vite-native testing for the Vue frontend
- ESM-compatible testing for the Node.js backend
- Unified testing experience across the stack

See [TESTING.md](TESTING.md) for more details on the testing setup.

## 📂 Key Directories

### Client

- `components/`: Reusable Vue components
- `views/`: Page components that correspond to routes
- `services/`: API client services for data fetching
- `router/`: Vue Router configuration
- `assets/`: Static resources like images and styles
- `types/`: TypeScript interfaces and type definitions

### Server

- `controllers/`: Business logic for handling requests
- `routes/`: API route definitions
- `middleware/`: Express middleware
- `config/`: Server configuration
- `models/`: Data models and database schema

## 🔄 API Endpoints

- `GET /health`: Health check endpoint (returns server status)
- `GET /api/hello`: Sample API endpoint (returns greeting message)

## 📋 License

ISC
