<div align="center">
  <h1>CodeForge Enterprise</h1>
  <p>Enterprise-grade competitive coding platform with AI-powered debugging, real-time sandboxing, leaderboards, and contests.</p>
</div>

## Project Structure

```
codeforge/
├── client/                   # Frontend — React + Vite + Tailwind
│   ├── build/               # Production frontend build output
│   └── src/
│       ├── components/       # UI components (ProblemDetails, Dashboard, etc.)
│       ├── hooks/            # Custom React hooks (useProblems, useSubmissions)
│       └── utils/            # Utilities (toast, ErrorBoundary)
│
├── server/                   # Backend — Express + TypeScript
│   ├── index.ts              # Main server entry point
│   ├── config/
│   │   ├── env.js            # Environment variable config
│   │   └── seedData.js       # In-memory seed data (problems, users, etc.)
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Express middleware (validation, etc.)
│   ├── models/               # Mongoose models
│   ├── routes/               # Express route definitions
│   └── utils/
│       └── gemini.js         # Mistral AI debug session logic
│
├── .env                      # Environment variables (never commit this)
├── .env.example              # Reference template for environment variables
├── package.json              # Root package (manages full-stack deps + scripts)
├── docker-compose.yml        # Docker Compose for local development
└── Dockerfile                # Multi-stage production Docker build
```

## Run Locally

**Prerequisites:** Node.js 18+ and MongoDB

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Copy `.env.example` to `.env` (or create a `.env` file) and fill in the values:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/codeforge
   JWT_SECRET=your_super_secret_key
   MISTRAL_API_KEY=your_mistral_api_key
   ```

3. **Start the database:**
   Ensure your local MongoDB instance is running.

4. **Start the Application:**
   In the root directory, run:
   ```bash
   npm run dev
   ```
   *This command uses `concurrently` to automatically start BOTH:*
   - *Backend API on `http://localhost:3000`*
   - *Frontend React app on `http://localhost:5173`*

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend servers simultaneously |
| `npm run dev:server` | Start backend server with Node |
| `npm run dev:client` | Start frontend server (Vite) |
| `npm run build` | Build frontend (Vite) + bundle server (esbuild) |
| `npm start` | Run production build (`dist/server.cjs`) |

## Docker

```bash
docker-compose up --build
```
