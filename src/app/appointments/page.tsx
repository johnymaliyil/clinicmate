import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, LinkButton, Card, EmptyState, Badge } from "@/components/ui";

const statusTone = {
  SCHEDULED: "blue",
  COMPLETED: "green",
  CANCELLED: "red",
  NO_SHOW: "amber",
} as const;

export default async function AppointmentsPage() {
  const appointments = await prisma.appointment.findMany({
    orderBy: { date: "asc" },
    include: { patient: true },
  });

  const upcoming = appointments.filter(
    (a) => a.status === "SCHEDULED" && a.date >= new Date(new Date().toDateString())
  );

  return (
    <div>
      <PageHeader
        title="Appointments"
        description={`${upcoming.length} upcoming · ${appointments.length} total`}
        action={<LinkButton href="/appointments/new">+ Book appointment</LinkButton>}
      />

      {appointments.length === 0 ? (
        <EmptyState message="No appointments booked yet. Click “Book appointment” to schedule one." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Date &amp; Time</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-900">
                    <Link href={`/appointments/${a.id}`} className="font-medium hover:text-teal-700">
                      {new Date(a.date).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <Link href={`/patients/${a.patientId}`} className="hover:text-teal-700">
                      {a.patient.firstName} {a.patient.lastName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{a.doctorName}</td>
                  <td className="px-4 py-3 text-slate-600">{a.department ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone[a.status]}>{a.status.replace("_", " ")}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
