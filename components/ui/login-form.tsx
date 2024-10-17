"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (data) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res && res.ok) {
      router.push("/dashboard");
    } else {
      setError(res?.error ?? null);
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <Image src="/brand.png" alt="Logo" width={548} height={200} />
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              type="email"
              placeholder="m@ejemplo.com"
              {...register("email", {
                required: {
                  value: true,
                  message: "El correo electrónico es requerido",
                },
              })}
            />
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message?.toString()}
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              type="password"
              {...register("password", {
                required: {
                  value: true,
                  message: "La contraseña es requerida",
                },
              })}
            />
            {errors.password && (
              <span className="text-red-500 text-xs">
                {errors.password.message?.toString()}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Iniciar sesión</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
