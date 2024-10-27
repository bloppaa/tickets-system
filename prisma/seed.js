// TODO
/**
 * ! Script para llenar la base de datos con datos de prueba
 * ! Eliminar antes de pasar a producción
 */

import { PrismaClient } from "@prisma/client";
import { people } from "./data.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  for (const person of people) {
    const hashedPassword = await bcrypt.hash(person.password, 10);
    person.password = hashedPassword;

    await prisma.person.upsert({
      where: { email: person.email },
      update: {},
      create: person,
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
