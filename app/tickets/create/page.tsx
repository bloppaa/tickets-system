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

const CreateTicketPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-xl">Crear ticket de soporte</CardTitle>
          <CardDescription>
            Por favor, proporciona los detalles de tu problema para que podamos
            ayudarte mejor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Título</Label>
                <Input id="title" placeholder="Resumen breve del problema" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="type">Tipo de problema</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecciona el tipo de problema" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="hardware">Hardware</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="priority">Prioridad</Label>
                <Select>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Selecciona la prioridad" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="baja">Baja</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Descripción del problema</Label>
                <Textarea
                  id="description"
                  placeholder="Describe tu problema en detalle"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="">
          <Button className="w-full">Crear ticket</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
export default CreateTicketPage;
