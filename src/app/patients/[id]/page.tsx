import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader, LinkButton, Badge } from "@/components/ui";
import { DeleteButton } from "./DeleteButton";

function age(dob: Date) {
  const diff = Date.now() - dob.getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

const statusTone = {
  SCHEDULED: "blue",
  COMPLETED: "green",
  CANCELLED: "red",
  NO_SHOW: "amber",
} as const;

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: { appointments: { orderBy: { date: "desc" } } },
  });

  if (!patient) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${patient.firstName} ${patient.lastName}`}
        description={`${age(patient.dateOfBirth)} years old · ${patient.gender}`}
        action={
          <div className="flex gap-3">
            <LinkButton href={`/appointments/new?patientId=${patient.id}`} variant="secondary">
              Book appointment
            </LinkButton>
            <LinkButton href={`/patients/${patient.id}/edit`}>Edit</LinkButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Details
          </h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-slate-500">Phone</dt>
              <dd className="font-medium text-slate-900">{patient.phone}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Email</dt>
              <dd className="font-medium text-slate-900">{patient.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Address</dt>
              <dd className="font-medium text-slate-900">{patient.address ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Blood group</dt>
              <dd className="font-medium text-slate-900">{patient.bloodGroup ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Allergies / notes</dt>
              <dd className="font-medium text-slate-900">{patient.allergies ?? "—"}</dd>
            </div>
          </dl>
          <div className="mt-6 border-t border-slate-100 pt-4">
            <DeleteButton patientId={patient.id} />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Appointment history
          </h2>
          {patient.appointments.length === 0 ? (
            <p className="text-sm text-slate-500">No appointments yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {patient.appointments.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <Link
                      href={`/appointments/${a.id}`}
                      className="font-medium text-slate-900 hover:text-teal-700"
                    >
                      {a.doctorName}
                    </Link>
                    <p className="text-slate-500">
                      {new Date(a.date).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <Badge tone={statusTone[a.status]}>{a.status.replace("_", " ")}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
