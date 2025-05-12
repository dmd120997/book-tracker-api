import prisma from "../prisma";
import { Prisma, Book } from '@prisma/client';
import { z } from 'zod';
import { createBookSchema, updateBookSchema } from '../schemas/bookSchema';
import { BookDTO, toBookDTO, toBookDTOs } from '../dto/book.dto';

type BookInput = z.infer<typeof createBookSchema>;
type BookUpdateInput = z.infer<typeof updateBookSchema>;

export const BookService = {
  getById: async (id: string, userId: string): Promise<BookDTO | null> => {
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book || book.userId !== userId) return null;
  return toBookDTO(book);
},

  getAllByUser: async (userId: string): Promise<BookDTO[]> => {
  const books = await prisma.book.findMany({ where: { userId } });
  return toBookDTOs(books);
},

create: async (data: BookInput, userId: string) => {
  return prisma.book.create({
    data: {
      ...data,
      userId,
    },
  });
},

  update: async (
  id: string,
  userId: string,
  data: BookUpdateInput
): Promise<Book | null> => {
  const existing = await prisma.book.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) return null;

  return prisma.book.update({
    where: { id },
    data,
  });
},

  delete: async (
  id: string,
  userId: string
): Promise<boolean> => {
  const existing = await prisma.book.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) return false;

  await prisma.book.delete({ where: { id } });
  return true;
},
};
