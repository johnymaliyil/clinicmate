import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader, Badge } from "@/components/ui";
import { StatusActions } from "./StatusActions";

const statusTone = {
  SCHEDULED: "blue",
  COMPLETED: "green",
  CANCELLED: "red",
  NO_SHOW: "amber",
} as const;

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { patient: true },
  });

  if (!appointment) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Appointment with ${appointment.doctorName}`}
        description={new Date(appointment.date).toLocaleString(undefined, {
          dateStyle: "full",
          timeStyle: "short",
        })}
        action={<Badge tone={statusTone[appointment.status]}>{appointment.status.replace("_", " ")}</Badge>}
      />

      <Card className="max-w-2xl space-y-4">
        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Patient</dt>
            <dd className="font-medium text-slate-900">
              <Link href={`/patients/${appointment.patient.id}`} className="hover:text-teal-700">
                {appointment.patient.firstName} {appointment.patient.lastName}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Doctor</dt>
            <dd className="font-medium text-slate-900">{appointment.doctorName}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Department</dt>
            <dd className="font-medium text-slate-900">{appointment.department ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Patient phone</dt>
            <dd className="font-medium text-slate-900">{appointment.patient.phone}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-slate-500">Reason for visit</dt>
            <dd className="font-medium text-slate-900">{appointment.reason ?? "—"}</dd>
          </div>
        </dl>
        <div className="border-t border-slate-100 pt-4">
          <StatusActions id={appointment.id} currentStatus={appointment.status} />
        </div>
      </Card>
    </div>
  );
}
