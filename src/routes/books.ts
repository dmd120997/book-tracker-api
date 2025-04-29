import { FastifyInstance } from 'fastify';
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBooksByUser,
} from '../controllers/books';

export default async function bookRoutes(fastify: FastifyInstance) {
  fastify.get('/books', getAllBooks);
  fastify.get('/books/:id', getBookById);
  fastify.post('/books', createBook);
  fastify.put('/books/:id', updateBook);
  fastify.delete('/books/:id', deleteBook);

  fastify.get('/users/:id/books', getBooksByUser);
}
