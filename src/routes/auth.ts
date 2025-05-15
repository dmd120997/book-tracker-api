import { FastifyInstance } from 'fastify';
import { login, register } from '../controllers/auth';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', register);
  fastify.post('/login', login);
}
