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

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const tickets = await prisma.ticket.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const translatedTickets = tickets.map((ticket) => {
      let translatedPriority;
      switch (ticket.priority) {
        case Priority.Low:
          translatedPriority = "Baja";
          break;
        case Priority.Medium:
          translatedPriority = "Media";
          break;
        case Priority.High:
          translatedPriority = "Alta";
          break;
        default:
          translatedPriority = ticket.priority;
      }

      let translatedType;
      switch (ticket.type) {
        case Type.Hardware:
          translatedType = "Hardware";
          break;
        case Type.Software:
          translatedType = "Software";
          break;
        case Type.Other:
          translatedType = "Otro";
          break;
        default:
          translatedType = ticket.type;
      }

      let translatedStatus;
      switch (ticket.status) {
        case Status.Open:
          translatedStatus = "Abierto";
          break;
        case Status.InProgress:
          translatedStatus = "En progreso";
          break;
        case Status.Closed:
          translatedStatus = "Cerrado";
          break;
        default:
          translatedStatus = ticket.status;
      }

      const formattedCreatedAt = new Date(ticket.createdAt).toLocaleDateString(
        "es-ES"
      );
      const formattedUpdatedAt = new Date(ticket.updatedAt).toLocaleDateString(
        "es-ES"
      );

      return {
        ...ticket,
        priority: translatedPriority,
        type: translatedType,
        status: translatedStatus,
        createdAt: formattedCreatedAt,
        updatedAt: formattedUpdatedAt,
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
