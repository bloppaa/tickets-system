import { Ticket, columns } from "./columns";
import { DataTable } from "@/components/data-table";

async function getData(): Promise<Ticket[]> {
  const res = await import("@/app/api/tickets/route");
  if (!(await res.GET()).ok) {
    throw new Error("Failed to fetch data");
  }
  return await (await res.GET()).json();
}

export default async function Page() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
