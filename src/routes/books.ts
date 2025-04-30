import { FastifyInstance } from 'fastify';
import prisma from '../prisma';
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBooksByUser,
} from '../controllers/books';

export default async function bookRoutes(fastify: FastifyInstance) {
  fastify.get('/books', { preHandler: fastify.authenticate }, async (req, reply) => {
  const books = await prisma.book.findMany({
    where: { userId: req.user.id }
  });
  reply.send(books);
});
  fastify.get('/books/:id', getBookById);
  fastify.post('/books', createBook);
  fastify.put('/books/:id', updateBook);
  fastify.delete('/books/:id', deleteBook);

  fastify.get('/users/:id/books', getBooksByUser);
}
