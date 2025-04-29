import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  
  const newUser = await prisma.user.create({
    data: {
      email: 'example@example.com',
      password: 'securepassword',
    },
  });

  console.log('User created:', newUser);

  
  const newBook = await prisma.book.create({
    data: {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      pages: 180,
      status: 'reading',
      userId: newUser.id, 
    },
  });

  console.log('Book created:', newBook);
}


main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
