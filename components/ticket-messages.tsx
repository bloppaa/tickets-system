"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { useSession } from "next-auth/react";

type TicketMessageProps = {
  messages: {
    id: number;
    person: {
      name: string;
      avatar: string | undefined;
    };
    content: string;
    timestamp: string;
  }[];
};

export default function TicketMessages(props: TicketMessageProps) {
  const [messages, setMessages] = useState(props.messages);
  const [newMessage, setNewMessage] = useState("");
  const { data: session } = useSession();

  const handleSendMessage = () => {
    if (newMessage.trim() && session?.user) {
      const message = {
        id: messages.length + 1,
        person: {
          name: session.user.name || "",
          avatar: session.user.image || "",
        },
        content: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mensajes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex space-x-3">
              <Avatar>
                <AvatarImage
                  src={message.person.avatar ?? ""}
                  alt={message.person.name}
                />
                <AvatarFallback>
                  {message.person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-semibold">
                    {message.person.name}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp}
                  </span>
                </div>
                <p className="mt-1 text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex space-x-2">
          <Input
            placeholder="Escribe tu mensaje aquí..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>Enviar</Button>
        </div>
      </CardContent>
    </Card>
  );
}
