import TicketInfo from "@/components/ticket-info";
import TicketMessages from "@/components/ticket-messages";
import { TicketInfoProps } from "@/components/ticket-info";

async function getTicket(params: {
  params: { id: string };
}): Promise<TicketInfoProps["data"]> {
  const res = await import("@/app/api/tickets/[id]/route");
  const request = new Request(
    `${process.env.NEXTAUTH_URL}/api/tickets/${params.params.id}`,
    {
      method: "GET",
    }
  );

  if (!(await res.GET(request, params)).ok) {
    throw new Error("Failed to fetch data");
  }

  return await (await res.GET(request, params)).json();
}

const initialMessages = [
  {
    id: 1,
    person: {
      name: "John Doe",
      avatar: "",
    },
    content:
      "Hello, I'm having trouble with my account. Can you help me with this?",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    person: {
      name: "Jane Doe",
      avatar: "",
    },
    content: "Sure! I'd be happy to help you with that.",
    timestamp: "1 hour ago",
  },
];

export default async function TicketView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const ticketData = await getTicket({ params: { id } });

  return (
    <div className="container mx-auto py-4 md:px-10 space-y-6">
      <TicketInfo data={ticketData} />
      <TicketMessages messages={initialMessages} />
    </div>
  );
}
