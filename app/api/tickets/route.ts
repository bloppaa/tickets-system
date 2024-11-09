import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { z } from "zod";
import prisma from "@/lib/db";
import { Priority, Type, Status, Prisma } from "@prisma/client";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (session?.user.role !== "Client" && session?.user.role !== "Admin") {
    return new Response(JSON.stringify({ message: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();

    const ticketSchema = z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      type: z.enum(["hardware", "software", "other"]),
      priority: z.enum(["low", "medium", "high"]),
    });

    const parsedBody = ticketSchema.safeParse(body);

    if (!parsedBody.success) {
      return new Response(JSON.stringify(parsedBody.error.errors), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const { title, description, type, priority } = parsedBody.data;

    await prisma.ticket.create({
      data: {
        title,
        description,
        type: capitalize(type) as Type,
        priority: capitalize(priority) as Priority,
        client: { connect: { id: parseInt(session.user.id as string) } },
      },
    });

    return new Response(
      JSON.stringify({ message: "Ticket creado con éxito" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Hubo un error al crear el ticket" }),
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
      const translatedPriority =
        {
          [Priority.Low]: "Baja",
          [Priority.Medium]: "Media",
          [Priority.High]: "Alta",
        }[ticket.priority] || ticket.priority;

      const translatedType =
        {
          [Type.Hardware]: "Hardware",
          [Type.Software]: "Software",
          [Type.Other]: "Otro",
        }[ticket.type] || ticket.type;

      const translatedStatus =
        {
          [Status.Open]: "Abierto",
          [Status.InProgress]: "En progreso",
          [Status.Closed]: "Cerrado",
        }[ticket.status] || ticket.status;

      return {
        ...ticket,
        priority: translatedPriority,
        type: translatedType,
        status: translatedStatus,
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
