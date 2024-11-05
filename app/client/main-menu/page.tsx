'use client'

import * as React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TicketIcon, UserIcon, ChartBarIcon, CogIcon, BellIcon, QuestionMarkCircleIcon, RectangleStackIcon } from '@heroicons/react/24/outline'

export default function MainMenu() {
  const router = useRouter()

  const menuItems = [
    { title: 'Crear Tickets', description: 'Crear tickets de soporte', icon: TicketIcon, href: '/client/create-ticket' },
    { title: 'Mis tickets', description: 'Revisa el estado de tus ticket', icon: RectangleStackIcon, href: '/settings' },
    { title: 'Notificaciones', description: 'Gestionar notificaciones y alertas', icon: BellIcon, href: '/notifications' },
  ]

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-center mb-6">
      <Image src="/brand.png" alt="Logo" width={548} height={200} />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
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
      <footer className="mt-10 text-center text-sm text-gray-500">
        <p>&copy; 2023 Sistema de Gestión de Tickets. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}