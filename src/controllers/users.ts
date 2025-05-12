import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/userService';

export const getMe = async (req: FastifyRequest, reply: FastifyReply) => {
  const user = await UserService.getPublicUser(req.user.id);
  if (!user) return reply.code(404).send({ message: 'User not found' });
  return reply.send(user); 
};
