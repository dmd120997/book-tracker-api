import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../prisma";
import { createBookSchema } from "../schemas/bookSchema";
import { updateBookSchema } from "../schemas/bookSchema";
import { bookIdParamSchema } from "../schemas/bookSchema";
import { validateBody, validateParams } from "../utils/validate";
import { z } from "zod";

export const getAllBooks = async (req: FastifyRequest, reply: FastifyReply) => {
  const books = await prisma.book.findMany();
  return books;
};

export const getBookById = async (req: FastifyRequest, reply: FastifyReply) => {
  const params = await validateParams(bookIdParamSchema, req, reply);
  if (!params) return;

  const book = await prisma.book.findUnique({
    where: {
      id: params.id,
      userId: req.user.id,
    },
  });

  if (!book) {
    return reply.code(404).send({ message: "Book not found" });
  }

  return reply.send(book);
};

export const createBook = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const parsed = createBookSchema.parse(req.body);

    const book = await prisma.book.create({
      data: {
        ...parsed,
        userId: req.user.id,
      },
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
  const params = await validateParams(bookIdParamSchema, req, reply);
  if (!params) return;

  const body = await validateBody(updateBookSchema, req, reply);
  if (!body) return;

    const book = await prisma.book.findUnique({
    where: {
      id: params.id,
      userId: req.user.id,
    },
  });

  if (!book) {
    return reply.code(404).send({ message: 'Book not found or access denied' });
  }

  const updated = await prisma.book.update({
    where: { id: params.id },
    data: body,
  });

  return reply.send(updated);
};


export const deleteBook = async (req: FastifyRequest, reply: FastifyReply) => {
  const params = await validateParams(bookIdParamSchema, req, reply);
  if (!params) return;

  const book = await prisma.book.findUnique({
    where: {
      id: params.id,
      userId: req.user.id,
    },
  });

  if (!book) {
    return reply.code(404).send({ message: 'Book not found or access denied' });
  }

  await prisma.book.delete({ where: { id: params.id } });

  return reply.code(204).send();
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
