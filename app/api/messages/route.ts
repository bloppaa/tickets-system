import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { z } from "zod";
import prisma from "@/lib/db";
import { Priority, Type, Status, Prisma } from "@prisma/client";
import { translations } from "@/prisma/translations";
import { log } from "console";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (session?.user.role !== "Client" && session?.user.role !== "User") {
    return new Response(JSON.stringify({ message: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const content = await request.json();
    const personId = parseInt(session.user?.id as string);
    const ticketId = parseInt(
      request.headers.get("referer")?.split("/").pop() as string
    );

    const body = { content, personId, ticketId };

    const messageSchema = z.object({
      content: z.string().min(1, "Content is required"),
      personId: z.number().positive("Person ID is required"),
      ticketId: z.number().positive("Ticket ID is required"),
    });

    const parsedBody = messageSchema.safeParse(body);

    if (!parsedBody.success) {
      return new Response(JSON.stringify(parsedBody.error.errors), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    await prisma.message.create({
      data: {
        content: parsedBody.data.content,
        person: { connect: { id: parsedBody.data.personId } },
        ticket: { connect: { id: parsedBody.data.ticketId } },
      },
    });

    return new Response(
      JSON.stringify({ message: "Mensaje creado con éxito" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Hubo un error al crear el mensaje" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const whereCondition: Prisma.TicketWhereInput = {};

    const status = searchParams.get("status");
    if (status) {
      whereCondition.status = capitalize(status) as Status;
    }

    const priority = searchParams.get("priority");
    if (priority) {
      whereCondition.priority = capitalize(priority) as Priority;
    }

    const type = searchParams.get("type");
    if (type) {
      whereCondition.type = capitalize(type) as Type;
    }

    const assigned = searchParams.get("assigned");
    if (assigned === "false") {
      whereCondition.userId = null;
    } else if (assigned === "true") {
      whereCondition.userId = { not: null };
    }

    const clientRut = searchParams.get("clientRut");
    if (clientRut) {
      whereCondition.client = { rut: clientRut };
    }

    const userId = searchParams.get("userId");
    if (userId) {
      whereCondition.userId = parseInt(userId);
    }

    const tickets = await prisma.ticket.findMany({
      where: whereCondition,
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        status: true,
        priority: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        client: {
          select: { rut: true, name: true, email: true, companyRut: true },
        },
      },
    });

    const translatedTickets = tickets.map((ticket) => {
      return {
        ...ticket,
        priority: translations.priority[ticket.priority],
        type: translations.type[ticket.type],
        status: translations.status[ticket.status],
        createdAt: new Date(ticket.createdAt).toLocaleDateString("es-ES"),
        updatedAt: new Date(ticket.updatedAt).toLocaleDateString("es-ES"),
      };
    });

    return new Response(JSON.stringify(translatedTickets), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Hubo un error al obtener los tickets" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
