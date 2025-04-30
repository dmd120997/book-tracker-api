import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export default async function authRoutes(server: FastifyInstance) {
  server.post('/register', async (req, reply) => {
    const { email, password } = req.body as { email: string; password: string };

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return reply.status(400).send({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    reply.send({ token });
  });

  server.post('/login', async (req, reply) => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return reply.status(401).send({ error: 'Invalid email or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return reply.status(401).send({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: '7d',
  });

  reply.send({ token });
});
}
