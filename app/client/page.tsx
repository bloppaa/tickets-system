"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TicketIcon,
  RectangleStackIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export default function MainMenu() {
  const router = useRouter();

  const menuItems = [
    {
      title: "Crear ticket",
      description: "Crea un nuevo ticket de soporte",
      icon: TicketIcon,
      href: "/client/create-ticket",
    },
    {
      title: "Mis tickets",
      description: "Revisa el estado de tus tickets",
      icon: RectangleStackIcon,
      href: "",
    },
    {
      title: "Preferencias de la cuenta",
      description: "Configura las preferencias de tu cuenta",
      icon: Cog6ToothIcon,
      href: "",
    },
  ];

  return (
    <div className="container mx-auto py-10 md:px-10">
      <div className="flex justify-center mb-10">
        <Image src="/brand.png" alt="Logo" width={411} height={150} />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <item.icon className="h-6 w-6 mr-2" />
                {item.title}
              </CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" onClick={() => router.push(item.href)}>
                Acceder
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
