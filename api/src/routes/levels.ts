import { FastifyPluginAsync } from 'fastify'

const levels: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get('/levels', async (request, reply) => {
    // TODO: Implement level listing
    return { levels: [] }
  })

  fastify.post('/levels', async (request, reply) => {
    // TODO: Implement level creation
    return { levelId: 'placeholder' }
  })
}

export default levels