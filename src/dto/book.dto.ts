import { Book } from '@prisma/client';

export type BookDTO = Omit<Book, 'userId'>;

export function toBookDTO(book: Book): BookDTO {
    const { userId, ...publicData } = book;
    return publicData;
}

export function toBookDTOs(books: Book[]): BookDTO[] {
    return books.map(toBookDTO);
}