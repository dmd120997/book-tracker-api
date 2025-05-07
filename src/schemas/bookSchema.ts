import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string().min(1, 'Name is required'),
  author: z.string().min(1, 'Author is required'),
  pages: z.number().int().positive('The number of pages must be positive.'),
  status: z.enum(['planned', 'reading', 'finished']),
});

export const updateBookSchema = z.object({
  title: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  pages: z.number().int().positive().optional(),
  status: z.enum(['planned', 'reading', 'finished']).optional(),
});

export const bookIdParamSchema = z.object({
  id: z.string().uuid({ message: 'Incorrect UUID format for id' }),
});