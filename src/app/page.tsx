import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, LinkButton, Badge } from "@/components/ui";

const statusTone = {
  SCHEDULED: "blue",
  COMPLETED: "green",
  CANCELLED: "red",
  NO_SHOW: "amber",
} as const;

export default async function Home() {
  const now = new Date();
  const startOfToday = new Date(now.toDateString());
  const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

  const [patientCount, upcomingCount, medicines, todaysAppointments] = await Promise.all([
    prisma.patient.count(),
    prisma.appointment.count({ where: { status: "SCHEDULED", date: { gte: now } } }),
    prisma.medicine.findMany(),
    prisma.appointment.findMany({
      where: { date: { gte: startOfToday, lt: endOfToday } },
      orderBy: { date: "asc" },
      include: { patient: true },
    }),
  ]);

  const lowStock = medicines.filter((m) => m.quantity <= m.reorderLevel);

  const stats = [
    { label: "Registered patients", value: patientCount, href: "/patients" },
    { label: "Upcoming appointments", value: upcomingCount, href: "/appointments" },
    { label: "Medicines low on stock", value: lowStock.length, href: "/inventory" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of today&apos;s clinic activity, {now.toLocaleDateString(undefined, { dateStyle: "full" })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition-shadow hover:shadow-md">
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{s.value}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Today&apos;s appointments
            </h2>
            <LinkButton href="/appointments/new" variant="secondary">
              Book
            </LinkButton>
          </div>
          {todaysAppointments.length === 0 ? (
            <p className="text-sm text-slate-500">No appointments scheduled for today.</p>
          ) : (
            <ul className="divide-y divide-slate-100 text-sm">
              {todaysAppointments.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <Link href={`/appointments/${a.id}`} className="font-medium text-slate-900 hover:text-teal-700">
                      {new Date(a.date).toLocaleTimeString(undefined, { timeStyle: "short" })} —{" "}
                      {a.patient.firstName} {a.patient.lastName}
                    </Link>
                    <p className="text-slate-500">{a.doctorName}</p>
                  </div>
                  <Badge tone={statusTone[a.status]}>{a.status.replace("_", " ")}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Low stock medicines
            </h2>
            <LinkButton href="/inventory/new" variant="secondary">
              Add medicine
            </LinkButton>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-slate-500">All medicines are adequately stocked.</p>
          ) : (
            <ul className="divide-y divide-slate-100 text-sm">
              {lowStock.map((m) => (
                <li key={m.id} className="flex items-center justify-between py-2.5">
                  <Link href={`/inventory/${m.id}`} className="font-medium text-slate-900 hover:text-teal-700">
                    {m.name}
                  </Link>
                  <span className="text-red-600">
                    {m.quantity} / {m.reorderLevel} {m.unit}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
