import { PrismaClient } from "@prisma/client";
import { users, clients } from "./data.js";

const prisma = new PrismaClient();

async function main() {
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
  for (const client of clients) {
    await prisma.client.upsert({
      where: { email: client.email },
      update: {},
      create: client,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Unexpected error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
