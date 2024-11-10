"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// Mock data for demonstration
const ticketData = {
  id: "TICKET-1234",
  title: "Unable to access dashboard",
  description:
    "I'm getting a 404 error when trying to access the main dashboard. This started happening after the latest update.",
  createdAt: "2023-11-09T10:30:00Z",
  updatedAt: "2023-11-10T14:45:00Z",
  status: "Open",
  type: "Bug",
  priority: "High",
  createdBy: {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  assignedTo: {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
  },
};

// Mock data for messages
const initialMessages = [
  {
    id: 1,
    user: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "I've been experiencing this issue since yesterday. Any updates?",
    timestamp: "2023-11-09T11:00:00Z",
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "We're looking into it. Can you provide more details about when exactly this started happening?",
    timestamp: "2023-11-09T11:30:00Z",
  },
];

export default function SupportTicketViewWithMessages() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        user: ticketData.assignedTo, // Assuming the current user is the assigned user
        content: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold mb-2">
                {ticketData.title}
              </CardTitle>
              <div className="flex space-x-2 mb-2">
                <Badge variant="outline">{ticketData.status}</Badge>
                <Badge variant="outline">{ticketData.type}</Badge>
                <Badge variant="outline">{ticketData.priority} Priority</Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Ticket ID: {ticketData.id}
              </p>
              <p className="text-sm text-muted-foreground">
                Created: {formatDate(ticketData.createdAt)}
              </p>
              <p className="text-sm text-muted-foreground">
                Last Updated: {formatDate(ticketData.updatedAt)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p>{ticketData.description}</p>
            </div>
            <Separator />
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Created By</h3>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage
                      src={ticketData.createdBy.avatar}
                      alt={ticketData.createdBy.name}
                    />
                    <AvatarFallback>
                      {ticketData.createdBy.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{ticketData.createdBy.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {ticketData.createdBy.email}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assigned To</h3>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage
                      src={ticketData.assignedTo.avatar}
                      alt={ticketData.assignedTo.name}
                    />
                    <AvatarFallback>
                      {ticketData.assignedTo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{ticketData.assignedTo.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {ticketData.assignedTo.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex space-x-3">
                <Avatar>
                  <AvatarImage
                    src={message.user.avatar}
                    alt={message.user.name}
                  />
                  <AvatarFallback>
                    {message.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-semibold">
                      {message.user.name}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex space-x-2">
            <Input
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
