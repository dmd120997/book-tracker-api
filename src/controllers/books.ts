import { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../prisma';
import { createBookSchema } from '../schemas/bookSchema';
import { z } from 'zod';




export const getAllBooks = async (req: FastifyRequest, reply: FastifyReply) => {
  const books = await prisma.book.findMany();
  return books;
};

export const getBookById = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const book = await prisma.book.findUnique({ where: { id: req.params.id } });
  if (!book) return reply.code(404).send({ message: 'Book not found' });
  return book;
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
        message: 'Validation error',
        errors: error.errors,
      });
    }

    return reply.code(500).send({ message: 'Something went wrong' });
  }
};

export const updateBook = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const { title, author, pages, status } = req.body as any;
  try {
    const book = await prisma.book.update({
      where: { id: req.params.id },
      data: { title, author, pages, status },
    });
    return book;
  } catch {
    return reply.code(404).send({ message: 'Book not found' });
  }
};

export const deleteBook = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    await prisma.book.delete({ where: { id: req.params.id } });
    return { message: 'The book has been removed.' };
  } catch {
    return reply.code(404).send({ message: 'Book not found' });
  }
};

export const getBooksByUser = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const books = await prisma.book.findMany({ where: { userId: req.params.id } });
  return books;
};
