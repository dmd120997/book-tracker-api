import { FastifyInstance } from 'fastify';
import { getMe } from '../controllers/users';

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/me', { preHandler: fastify.authenticate }, getMe);
}
