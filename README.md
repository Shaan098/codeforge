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

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```
   npm install
   ```

2. Set the `MISTRAL_API_KEY` in [.env](.env) to your Mistral API key

3. Start the dev server:
   ```
   npm run dev
   ```
   The API runs on `http://localhost:3000` and the Vite client on `http://localhost:5173`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server in dev mode (tsx hot reload) |
| `npm run build` | Build frontend (Vite) + bundle server (esbuild) |
| `npm start` | Run production build (`dist/server.cjs`) |

## Docker

```bash
docker-compose up --build
```
