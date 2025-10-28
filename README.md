# MicroPlay Hub

Social platform for 60-second browser micro-games where players play, create, share and compete. Free for all users.

## Features

- **60-second micro-games**: Fast-paced browser games with deterministic gameplay
- **User-created levels**: Level editor for creating and sharing custom levels
- **Leaderboards**: Real-time leaderboards with anti-cheat measures
- **Shareable results**: Generate share cards and short links for social sharing
- **Mobile-first UX**: Responsive design optimized for all devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Pixi.js
- **Backend**: Fastify, Node.js, TypeScript, Prisma, PostgreSQL
- **Real-time**: Socket.IO, Redis
- **Storage**: AWS S3 / MinIO, Redis for caching
- **Deployment**: Docker, GitHub Actions, Vercel/Railway

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm
- Docker & Docker Compose (for local dev)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/kawacukennedy/microplay-hub.git
   cd microplay-hub
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start local infrastructure:
   ```bash
   cd devops
   docker-compose up -d
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Run database migrations:
   ```bash
   cd api
   pnpm db:migrate
   pnpm seed
   ```

6. Start development servers:
   ```bash
   pnpm dev:all
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── web/           # Next.js frontend
├── api/           # Fastify backend API
├── workers/       # BullMQ job workers
├── shared/        # Shared TypeScript types
├── infra/         # Infrastructure as code
├── devops/        # Docker & local dev setup
└── .github/       # CI/CD workflows
```

## Development

See [DEVSETUP.md](./DEVSETUP.md) for detailed setup instructions.

## API Documentation

API endpoints are documented with OpenAPI. See [API.md](./API.md) for details.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for system design and architecture details.

## License

MIT