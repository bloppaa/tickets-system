"use client";

import * as React from "react";

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
import { useForm } from "react-hook-form";

const CreateTicketPage = () => {
  const router = useRouter();
  const { handleSubmit } = useForm();
  const [clientError, setClientError] = React.useState<string | null>(null);

  const onSubmit = handleSubmit(async (data) => {
    setClientError(null);

    const ticketData = {
      rut: data.clientRut,
      title: data.title,
      type: data.type,
      priority: data.priority,
      description: data.description,
    };

    const clientResponse = await fetch(`/api/clients?rut=${ticketData.rut}`);

    if (clientResponse.status === 404) {
      setClientError("No se encontró un cliente con ese RUT");
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
  });

  return (
    <div className="container mx-auto md:px-10 py-10 flex justify-center">
      <form onSubmit={onSubmit}>
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-xl">Crear ticket de soporte</CardTitle>
            <CardDescription>
              Por favor, proporciona los detalles del problema del cliente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">RUT del cliente</Label>
                <Input
                  id="clientRut"
                  name="clientRut"
                  placeholder="12345678-9"
                />
                {clientError && (
                  <span className="text-red-500 text-xs">{clientError}</span>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Resumen breve del problema"
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
                  placeholder="Describe el problema en detalle"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="">
            <Button className="w-full" type="submit">
              Crear ticket
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
export default CreateTicketPage;
