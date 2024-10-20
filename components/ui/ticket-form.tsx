'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  title: z.string().min(5, {
    message: "El título debe tener al menos 5 caracteres.",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
  priority: z.string(),
  email: z.string().email({
    message: "Por favor, introduce un email válido.",
  }),
})

export default function TicketForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "",
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    // Aquí iría la lógica para enviar el formulario a tu backend
    console.log(values)
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulando una petición al servidor
    setIsSubmitting(false)
    toast({
      title: "Ticket creado",
      description: "Tu ticket ha sido creado exitosamente.",
    })
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título del ticket</FormLabel>
              <FormControl>
                <Input placeholder="Escribe el título aquí" {...field} />
              </FormControl>
              <FormDescription>
                Proporciona un título breve pero descriptivo para tu ticket.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe tu problema o solicitud aquí"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Proporciona todos los detalles relevantes de tu problema o solicitud.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo de ticket" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="baja">tipo 1</SelectItem>
                  <SelectItem value="media">tipo 2</SelectItem>
                  <SelectItem value="alta">tipo 3</SelectItem>
                  <SelectItem value="urgente">tipo 3</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Selecciona el tipo que mejor describa tu ticket.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar ticket"}
        </Button>
      </form>
    </Form>
  )
}