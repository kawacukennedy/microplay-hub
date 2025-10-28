import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

export interface AuthUser {
  id: string
  type: 'user' | 'guest'
  guestId?: string
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ error: 'No token provided' })
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as AuthUser
    request.user = decoded
  } catch (error) {
    return reply.code(401).send({ error: 'Invalid token' })
  }
}

export async function optionalAuth(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as AuthUser
      request.user = decoded
    } catch (error) {
      // Ignore invalid tokens for optional auth
    }
  }
}

// Extend FastifyRequest interface
declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUser
  }
}