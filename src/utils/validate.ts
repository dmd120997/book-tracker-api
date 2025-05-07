import { ZodSchema } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function validateBody<T>(
  schema: ZodSchema<T>,
  req: FastifyRequest,
  reply: FastifyReply
): Promise<T | void> {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    reply.status(400).send({
      error: 'Validation failed',
      details: result.error.flatten(),
    });
    return;
  }
  return result.data;
}

export async function validateParams<T>(
  schema: ZodSchema<T>,
  req: FastifyRequest,
  reply: FastifyReply
): Promise<T | void> {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    reply.status(400).send({
      error: 'Invalid route parameter',
      details: result.error.flatten(),
    });
    return;
  }
  return result.data;
}
