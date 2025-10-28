import { FastifyPluginAsync } from 'fastify'

const scores: FastifyPluginAsync = async (fastify, opts) => {
  fastify.post('/scores', async (request, reply) => {
    // TODO: Implement score submission
    return { status: 'accepted', scoreId: 'placeholder' }
  })
}

export default scores