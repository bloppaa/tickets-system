import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { z } from "zod";
import prisma from "@/lib/db";
import { Priority, Type, Status, Prisma } from "@prisma/client";
import { translations } from "@/prisma/translations";

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
      type: z.enum(Object.keys(translations.type) as [string, ...string[]]),
      priority: z.enum(
        Object.keys(translations.priority) as [string, ...string[]]
      ),
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
    const { searchParams } = new URL(request.url);
    const clientId =
      parseInt(searchParams.get("clientRut") as string) ||
      parseInt(session.user.id as string);

    await prisma.ticket.create({
      data: {
        title,
        description,
        type: capitalize(type) as Type,
        priority: capitalize(priority) as Priority,
        client: { connect: { id: clientId } },
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
    const whereCondition: Prisma.TicketWhereInput =
      buildWhereCondition(searchParams);

    const tickets = await prisma.ticket.findMany({
      where: whereCondition,
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
        client: { select: { name: true, email: true } },
        user: { select: { name: true, email: true } },
      },
    });

    const translatedTickets = tickets.map((ticket) => {
      return {
        ...ticket,
        priority: translations.priority[ticket.priority],
        type: translations.type[ticket.type],
        status: translations.status[ticket.status],
        createdAt: new Date(ticket.createdAt).toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        updatedAt: new Date(ticket.updatedAt).toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
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

function buildWhereCondition(searchParams: URLSearchParams) {
  const whereCondition: Prisma.TicketWhereInput = {};

  // Filtro por estado del ticket . /api/tickets?status=open
  const status = searchParams.get("status")?.toLowerCase();
  if (status) {
    whereCondition.status = capitalize(status) as Status;
  }

  // Filtro por prioridad del ticket . /api/tickets?priority=high
  const priority = searchParams.get("priority")?.toLowerCase();
  if (priority) {
    whereCondition.priority = capitalize(priority) as Priority;
  }

  // Filtro por tipo de ticket . /api/tickets?type=issue
  const type = searchParams.get("type")?.toLowerCase();
  if (type) {
    whereCondition.type = capitalize(type) as Type;
  }

  // Filtro por si el ticket está asignado o no . /api/tickets?assigned=false
  const assigned = searchParams.get("assigned");
  if (assigned === "true") {
    whereCondition.userId = { not: null }; // Tickets con un usuario asignado
  } else if (assigned === "false" || !assigned) {
    whereCondition.userId = null; // Tickets sin un usuario asignado
  }

  // Filtro por ID de cliente . /api/tickets?clientId=456
  const clientId = searchParams.get("clientId");
  if (clientId) {
    whereCondition.clientId = parseInt(clientId);
  }

  // Filtro por ID de usuario asignado . /api/tickets?userId=789
  const userId = searchParams.get("userId");
  if (userId) {
    whereCondition.userId = parseInt(userId);
  }

  // Filtro por rango de fechas de creación . /api/tickets?createdFrom=2023-01-01&createdTo=2023-12-31
  const createdFrom = searchParams.get("createdFrom");
  const createdTo = searchParams.get("createdTo");
  if (createdFrom || createdTo) {
    whereCondition.createdAt = {
      ...(createdFrom ? { gte: new Date(createdFrom) } : {}),
      ...(createdTo ? { lte: new Date(createdTo) } : {}),
    };
  }

  // Filtro por rango de fechas de actualización . /api/tickets?updatedFrom=2023-01-01&updatedTo=2023-12-31
  const updatedFrom = searchParams.get("updatedFrom");
  const updatedTo = searchParams.get("updatedTo");
  if (updatedFrom || updatedTo) {
    whereCondition.updatedAt = {
      ...(updatedFrom ? { gte: new Date(updatedFrom) } : {}),
      ...(updatedTo ? { lte: new Date(updatedTo) } : {}),
    };
  }

  // Filtro por código específico de ticket . /api/tickets?ticketId=123
  const ticketId = searchParams.get("ticketId");
  if (ticketId) {
    whereCondition.id = parseInt(ticketId);
  }

  // Filtro de palabras clave en título o descripción . /api/tickets?keyword=printer
  const keyword = searchParams.get("keyword");
  if (keyword) {
    whereCondition.OR = [
      { title: { contains: keyword } },  
      { description: { contains: keyword } },
    ];
  }

  return whereCondition;
}