import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/db";
import { z } from "zod";

//Asignar técnico a un ticket, use patch porque puede cambiar recursos parcialmente y no todo 
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  // verificar que admin este con sesion iniciada
  if (!session || !session.user.isAdmin) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try { 
    const body = await request.json();

    const assignSchema = z.object({
      ticketId: z.number().int(),
      userId: z.number().int(),
    });

    const parsedBody = assignSchema.safeParse(body);

    if (!parsedBody.success) {
      return new Response(JSON.stringify(parsedBody.error.errors), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { ticketId, userId } = parsedBody.data;

    // Actualizar el ticket en la DB
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { userId: userId },
    });

    return new Response(
      JSON.stringify({ message: "Técnico asignado al ticket exitosamente" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Error al asignar técnico al ticket" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}