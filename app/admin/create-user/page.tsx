"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const CreateUserPage = () => {
  const router = useRouter();
  const [role, setRole] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const userData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      rut: formData.get("rut") as string,
      role: formData.get("role") as string,
      companyRut: formData.get("companyRut") as string,
      password: formData.get("password") as string,
    };

    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
      router.push("/");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-xl">Crear Usuario</CardTitle>
            <CardDescription>
              Ingresa los datos del nuevo usuario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nombre completo"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="rut">RUT</Label>
                <Input
                  id="rut"
                  name="rut"
                  placeholder="12.345.678-9"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="role">Rol</Label>
                <Select name="role" onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecciona el rol" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="User">Usuario</SelectItem>
                    <SelectItem value="Client">Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {role === "Client" && (
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="companyRut">RUT Empresa</Label>
                  <Input
                    id="companyRut"
                    placeholder="76.543.210-8"
                  />
                </div>
              )}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Crear Usuario
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default CreateUserPage;