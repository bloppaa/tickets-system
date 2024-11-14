import { authOptions } from "@/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const users = await prisma.person.findMany({
      where: { role: "User" },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Hubo un error al obtener los usuarios" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);


  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { name, email, rut, role, companyRut, password } = await request.json();

  try {
    await prisma.person.create({
      data: {
        name,
        email,
        rut,
        role,
        companyRut,
        password,
      },
    });

    return new Response(
      JSON.stringify({ message: "Usuario creado exitosamente" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Hubo un error al crear el usuario" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
