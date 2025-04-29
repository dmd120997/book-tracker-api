import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../prisma";
import { createBookSchema } from "../schemas/bookSchema";
import { updateBookSchema } from "../schemas/bookSchema";
import { bookIdParamSchema } from '../schemas/bookSchema';
import { z } from "zod";

export const getAllBooks = async (req: FastifyRequest, reply: FastifyReply) => {
  const books = await prisma.book.findMany();
  return books;
};

export const getBookById = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = bookIdParamSchema.parse(req.params);

    const book = await prisma.book.findUnique({ where: { id } });

    if (!book) {
      return reply.code(404).send({ message: 'Book not found' });
    }

    return reply.send(book);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.code(400).send({ message: 'Invalid id parameter', errors: error.errors });
    }
    return reply.code(500).send({ message: 'Error while receiving book' });
  }
};

export const createBook = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const parsed = createBookSchema.parse(req.body);

    const book = await prisma.book.create({
      data: parsed,
    });

    return reply.code(201).send(book);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.code(400).send({
        message: "Validation error",
        errors: error.errors,
      });
    }

    return reply.code(500).send({ message: "Something went wrong" });
  }
};

export const updateBook = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };

  try {
    const parsed = updateBookSchema.parse(req.body);

    const updated = await prisma.book.update({
      where: { id },
      data: parsed,
    });

    return reply.code(200).send(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.code(400).send({
        message: "Validation error",
        errors: error.errors,
      });
    }

    return reply.code(500).send({ message: "Error updating book" });
  }
};

export const deleteBook = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = bookIdParamSchema.parse(req.params);

    await prisma.book.delete({ where: { id } });

    return reply.code(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.code(400).send({ message: 'Invalid id parameter', errors: error.errors });
    }
    return reply.code(500).send({ message: 'Error deleting book' });
  }
};

export const getBooksByUser = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const books = await prisma.book.findMany({
    where: { userId: req.params.id },
  });
  return books;
};
