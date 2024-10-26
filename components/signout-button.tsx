"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default async function SignOutButton() {
  return <Button onClick={() => signOut()}>Cerrar Sesión</Button>;
}
