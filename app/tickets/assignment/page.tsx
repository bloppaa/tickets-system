
import { ActiveTicketsTable } from "@/components/ticket-assignment";


export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Asignación de tickets</h1>
      </div>
      <ActiveTicketsTable />
    </div>
  )
}