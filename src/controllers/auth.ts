import { FastifyRequest, FastifyReply } from 'fastify';
import { validateBody } from '../utils/validate';
import { loginSchema, registerSchema } from '../schemas/authSchema';
import { UserService } from '../services/userService';
import { getErrorMessage } from '../utils/errors';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const register = async (req: FastifyRequest, reply: FastifyReply) => {
  const data = await validateBody(registerSchema, req, reply);
  if (!data) return;

  try {
    const user = await UserService.register(data);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    reply.code(201).send({ token, user });
  } catch (err) {
    return reply.code(400).send({ error: getErrorMessage(err) });
  }
};

export const login = async (req: FastifyRequest, reply: FastifyReply) => {
  const data = await validateBody(loginSchema, req, reply);
  if (!data) return;

  const user = await UserService.login(data);
  if (!user) {
    return reply.code(401).send({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  reply.send({ token, user });
};
