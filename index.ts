import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here

  // Create test data
  await Promise.all([...Array(10)].map((_, i) => i).map((i) => {
    const id = i + 1;
    const email = `user${i}@example.com`;
    return prisma.user.upsert({
      where: { id },
      create: { id, email },
      update: {},
    })
  }));
  await Promise.all([...Array(10)].map((_, i) => i).map((i) => {
    const id = i + 1;
    const title = `title-${i}`;
    return prisma.post.upsert({
      where: { id },
      create: { id, title, authorId: id },
      update: {},
    })
  }));

  // Query which causes the error on Prisma Client 5.8.0
  const posts = await Promise.all([...Array(10)].map((_, i) => i).map((i) => {
    const id = i + 1;
    return prisma.post.findUnique({
      where: {
        id,
        OR: [
          { author: { id: id } }
        ]
      },
    })
  }));

  console.log(posts);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
