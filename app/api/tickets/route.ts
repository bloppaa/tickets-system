import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  console.log(body);

  return new Response("Ticket creado con éxito", { status: 201 });
}
