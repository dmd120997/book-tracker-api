import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string().min(1, 'Name is required'),
  author: z.string().min(1, 'Author is required'),
  pages: z.number().int().positive('The number of pages must be positive.'),
  status: z.enum(['planned', 'reading', 'finished']),
  userId: z.string().uuid('Invalid user UUID'),
});
