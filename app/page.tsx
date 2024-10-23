'use client'

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function HomePage() {
  return (
    <div>
      <Button onClick={() => signOut()}>Cerrar sesión</Button>
    </div>
  );
}
