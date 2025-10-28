# Architecture Overview

MicroPlay Hub is a social platform for 60-second browser micro-games with user-created levels, leaderboards, and sharing features.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js Web   │    │   Fastify API   │    │   BullMQ Jobs   │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Workers)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │     Redis       │    │   MinIO / S3    │
│   (Database)    │    │   (Cache/Queue) │    │   (Storage)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Core Components

### Frontend (Next.js)

- **Framework**: Next.js 14 with App Router
- **UI**: Tailwind CSS + Radix UI primitives
- **Game Engine**: Pixi.js for 2D rendering
- **State Management**: Zustand for game state, TanStack Query for server state
- **Real-time**: Socket.IO client for live leaderboards

### Backend (Fastify)

- **Framework**: Fastify with TypeScript
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: JWT with guest sessions
- **Real-time**: Socket.IO server with Redis adapter
- **Validation**: Zod schemas

### Workers (BullMQ)

- **Job Queue**: BullMQ with Redis
- **Tasks**:
  - Score validation and replay verification
  - Share image generation with Sharp
  - Background processing for moderation

### Database (PostgreSQL)

- **Schema**: Prisma-managed migrations
- **Models**:
  - Users (with roles: USER, CREATOR, MODERATOR, ADMIN)
  - Games (game definitions)
  - Levels (user-created content)
  - Scores (game results)

### Cache & Queue (Redis)

- **Leaderboards**: Sorted sets for real-time rankings
- **Sessions**: Ephemeral keys for anti-cheat
- **Pub/Sub**: Real-time leaderboard updates
- **Job Queue**: BullMQ for background tasks

### Storage (S3/MinIO)

- **Assets**: Game assets, thumbnails, share images
- **CDN**: CloudFront or Vercel edge for global distribution

## Game Engine Architecture

Games are deterministic micro-engines with a standardized SDK:

```typescript
interface GameEngine {
  init(config: GameConfig): void
  start(): Promise<GameResult>
  serialize(): LevelData
}
```

### Anti-Cheat Design

1. **Client Signing**: Ephemeral HMAC keys for score validation
2. **Replay Verification**: Server-side simulation of gameplay
3. **Heuristics**: Rate limiting, score validation rules
4. **Optimistic Updates**: Immediate leaderboard updates with background validation

## Data Flow

### Score Submission Flow

1. Client generates HMAC signature with ephemeral key
2. POST to `/api/scores` with signed payload
3. Server validates signature and quick heuristics
4. Optimistic write to Redis leaderboard
5. Background worker performs deep validation
6. Rollback if invalid, notify user

### Level Publishing Flow

1. Client uploads assets to presigned S3 URLs
2. POST level data to `/api/levels`
3. Server validates schema and content
4. Queue for moderation review
5. Manual approval publishes level

## Security Considerations

- JWT access tokens (short-lived)
- Ephemeral keys for score signing
- Content moderation for user-generated content
- Rate limiting and abuse detection
- Secure headers and CSP

## Scalability

- Horizontal scaling with Redis adapter for Socket.IO
- Database read replicas for leaderboard queries
- CDN for static assets
- Background job processing for heavy tasks

## Deployment

- **Frontend**: Vercel for static deployment
- **Backend**: Railway/Railway for containerized API
- **Workers**: Separate container for job processing
- **Database**: Managed PostgreSQL (Supabase/RDS)
- **Cache**: Managed Redis (Upstash/Redis Cloud)