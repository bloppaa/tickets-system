import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt";
import fs from "fs";

const prisma = new PrismaClient()

async function main() {
  const data = JSON.parse(fs.readFileSync("datatest.json", "utf-8"));

  for (const person of data) {
    // Hash password
    const hashedPassword = await bcrypt.hash(person.password, 10);

    // Upsert for insert or uptadete
    const createdPerson = await prisma.person.upsert({
      where: { rut: person.rut }, // search by RUT
      update: {},
      create: {
        name: person.name,
        email: person.email,
        rut: person.rut,
        password: hashedPassword,
        companyRut: person.companyRut,
        isClient: person.isClient,
        tickets: {
          create: person.tickets.map((ticket) => ({
            title: ticket.title,
            description: ticket.description,
            status: ticket.status,
          })),
        },
      },
    });

    console.log(`Person created or updated: ${createdPerson.email}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

/*
async function main() {
  const password1 = await bcrypt.hash("password1", 10);
  const user1 = await prisma.user.upsert({
    where: { email: "user1@gmail.com" },
    update: {},
    create: {
      name: "User 1",
      email: "user1@gmail.com",
      rut: "11.111.111-1",
      password: password1,
    },
  });
  const password2 = await bcrypt.hash("password2", 10);
  const user2 = await prisma.user.upsert({
    where: { email: "user2@gmail.com" },
    update: {},
    create: {
      name: "User 2",
      email: "user2@gmail.com",
      rut: "22.222.222-2",
      password: password2,
    },
  });
  const password3 = await bcrypt.hash("password3", 10);
  const user3 = await prisma.user.upsert({
    where: { email: "user3@gmail.com" },
    update: {},
    create: {
      name: "User 3",
      email: "user3@gmail.com",
      rut: "33.333.333-3",
      password: password3,
    },
  });
  console.log({ user1, user2, user3 });
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
*/