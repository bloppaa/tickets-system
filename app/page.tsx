import { authOptions } from "@/auth";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  console.log(session);

  return (
    <div>
      <Button>Cerrar sesión</Button>
    </div>
  );
}
