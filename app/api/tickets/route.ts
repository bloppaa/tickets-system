import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { z } from "zod";
import prisma from "@/lib/db";
import { Priority, Type, Status } from "@prisma/client";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
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
    const url = new URL(request.url);
    const statusFilter = url.searchParams.get("status") || undefined;
    const priorityFilter = url.searchParams.get("priority") || undefined;
    const assignmentFilter = url.searchParams.get("filter") || undefined;

    // aca se construyen los filtros 
    const filters: any = {};
    if (statusFilter) {
      filters.status = statusFilter as Status;
    }
    if (priorityFilter) {
      filters.priority = priorityFilter as Priority;
    }
    if (assignmentFilter === "unassigned") {
      filters.userId = null; // Filtrar solo tickets sin asignar
    } else if (assignmentFilter === "assigned") {
      filters.userId = { not: null }; // Filtrar solo tickets asignados
    }

    // aca se obtienen los tickes ordenados 
    const tickets = await prisma.ticket.findMany({
      where: filters,
      orderBy: [
        { userId: 'asc' }, // Ordenar por tickets sin asignar primero
        { createdAt: 'desc' } // despues por fecha
      ],
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
      },
    });

    // Traducir y formatear tickets
    const translatedTickets = tickets.map((ticket) => {
      const translatedPriority = {
        [Priority.Low]: "Baja",
        [Priority.Medium]: "Media",
        [Priority.High]: "Alta",
      }[ticket.priority] || ticket.priority;

      const translatedType = {
        [Type.Hardware]: "Hardware",
        [Type.Software]: "Software",
        [Type.Other]: "Otro",
      }[ticket.type] || ticket.type;

      const translatedStatus = {
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