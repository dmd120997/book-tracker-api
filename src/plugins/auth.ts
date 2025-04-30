import { FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export default fp(async (fastify) => {
  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
          return reply.status(401).send({ error: 'Missing token' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

       
        request.user = { id: decoded.userId };
      } catch (err) {
        return reply.status(401).send({ error: 'Invalid token' });
      }
    }
  );
});
