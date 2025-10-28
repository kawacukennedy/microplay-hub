# Development Setup

This guide covers setting up the MicroPlay Hub development environment.

## Prerequisites

- Node.js 20.x or later
- pnpm package manager
- Docker and Docker Compose
- Git

## Local Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/kawacukennedy/microplay-hub.git
cd microplay-hub
pnpm install
```

### 2. Start Infrastructure

```bash
cd devops
docker-compose up -d
```

This starts:
- PostgreSQL database on port 5432
- Redis on port 6379
- MinIO S3-compatible storage on ports 9000/9001

### 3. Environment Configuration

Copy the example environment file:

```bash
cp devops/.env.example .env
```

Edit `.env` with your local configuration:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/microplay
REDIS_HOST=localhost
REDIS_PORT=6379
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_ENDPOINT=http://localhost:9000
JWT_SECRET=your-development-secret-key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Database Setup

```bash
cd api
pnpm db:migrate
pnpm seed
```

### 5. Start Development Servers

From the root directory:

```bash
pnpm dev:all
```

This starts:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Workers: Background job processing

## Development Workflow

### Running Tests

```bash
pnpm test          # Run all tests
pnpm test:watch    # Run tests in watch mode
```

### Linting and Type Checking

```bash
pnpm lint          # Run ESLint
pnpm typecheck     # Run TypeScript type checking
```

### Building for Production

```bash
pnpm build         # Build all packages
```

## Troubleshooting

### Database Connection Issues

Ensure PostgreSQL is running:

```bash
cd devops
docker-compose ps
```

If needed, reset the database:

```bash
cd devops
docker-compose down -v
docker-compose up -d
cd ../api
pnpm db:migrate
pnpm seed
```

### Port Conflicts

If ports 3000, 3001, 5432, 6379, or 9000 are in use, update the docker-compose.yml file to use different ports.

### MinIO Console

Access MinIO web console at http://localhost:9001 with credentials `minioadmin` / `minioadmin`.

## IDE Setup

### VS Code

Recommended extensions:
- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- Prisma

Add to `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```