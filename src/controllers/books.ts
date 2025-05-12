import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../prisma";
import { createBookSchema } from "../schemas/bookSchema";
import { updateBookSchema } from "../schemas/bookSchema";
import { bookIdParamSchema } from "../schemas/bookSchema";
import { BookService } from '../services/bookService';
import { validateBody, validateParams } from "../utils/validate";
import { z } from "zod";


export const getAllBooks = async (req: FastifyRequest, reply: FastifyReply) => {
  const books = await BookService.getAllByUser(req.user.id);
  return reply.send(books); 
};

export const getBookById = async (req: FastifyRequest, reply: FastifyReply) => {
  const params = await validateParams(bookIdParamSchema, req, reply);
  if (!params) return;

  const book = await BookService.getById(params.id, req.user.id);

  if (!book) {
    return reply.code(404).send({ message: 'Book not found' });
  }

  return reply.send(book); 
};

export const createBook = async (req: FastifyRequest, reply: FastifyReply) => {
  const data = await validateBody(createBookSchema, req, reply);
  if (!data) return;

  const newBook = await BookService.create(data, req.user.id);
  return reply.code(201).send(newBook); 
};

export const updateBook = async (req: FastifyRequest, reply: FastifyReply) => {
  const params = await validateParams(bookIdParamSchema, req, reply);
  if (!params) return;

  const data = await validateBody(updateBookSchema, req, reply);
  if (!data) return;

  const updated = await BookService.update(params.id, req.user.id, data);
  if (!updated) return reply.code(404).send({ message: 'Book not found or access denied' });

  return reply.send(updated); 
};


export const deleteBook = async (req: FastifyRequest, reply: FastifyReply) => {
  const params = await validateParams(bookIdParamSchema, req, reply);
  if (!params) return;

  const deleted = await BookService.delete(params.id, req.user.id);
  if (!deleted) return reply.code(404).send({ message: 'Book not found or access denied' });

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
