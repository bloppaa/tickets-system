"use client";

import * as React from "react";
import DOMPurify from "dompurify";

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
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

const CreateTicketPage = () => {
  const router = useRouter();

  // Desabilita temporalemte el boton de envío al hacer clic
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    // Se utiliza DOMPurify para sanitizar los inputs. Previene inyecciones HTML o script maliciosos
    const ticketData = {
      title: DOMPurify.sanitize(formData.get("title") as string),
      type: DOMPurify.sanitize(formData.get("type") as string),
      priority: DOMPurify.sanitize(formData.get("priority") as string),
      description: DOMPurify.sanitize(formData.get("description") as string),
    };

    // Verificar la seleccion de tipo de problema
    if (!["hardware", "software", "other"].includes(ticketData.type)) {
      alert("Selecciona el Tipo de Problema");
      return;
    }
    
    // Verificar la seleccion de prioridad
    if (!["low", "medium", "high"].includes(ticketData.priority)) {
      alert("Selecciona la Prioridad");
      return;
    }

    const response = await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketData),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
    } else {
      alert(result.message);
    }
    router.push("/");

    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-xl">Crear ticket de soporte</CardTitle>
            <CardDescription>
              Por favor, proporciona los detalles de tu problema para que
              podamos ayudarte mejor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Resumen breve del problema"
                  minLength={3}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="type">Tipo de problema</Label>
                <Select name="type">
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecciona el tipo de problema" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="hardware">Hardware</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="priority">Prioridad</Label>
                <Select name="priority">
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Selecciona la prioridad" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Descripción del problema</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe tu problema en detalle"
                  minLength={30}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="">
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Crear ticket"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
export default CreateTicketPage;
