import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient()

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function createOrUpdatePerson(person, hashedPassword) {
  return await prisma.person.upsert({
    where: { rut: person.rut },
    update: {},
    create: {
      name: person.name,
      email: person.email,
      rut: person.rut,
      password: hashedPassword,
      companyRut: person.companyRut,
      isClient: person.isClient,
      tickets: {
        create: person.tickets ? person.tickets.map((ticket) => ({
          title: ticket.title,
          description: ticket.description,
          status: ticket.status,
        })) : [],
      },
    },
  });
}

async function main() {
  const data = JSON.parse(fs.readFileSync("datatest.json", "utf-8"));
  
  await Promise.all(data.map(async (person) => {
    const hashedPassword = await hashPassword(person.password);
    const createdPerson = await createOrUpdatePerson(person, hashedPassword);
    console.log(`Person created or updated: ${createdPerson.name}`);
  }));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Unexpected error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });