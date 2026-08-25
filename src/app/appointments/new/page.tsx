import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader, Field, Input, Select, Textarea, Button, LinkButton } from "@/components/ui";
import { createAppointment } from "../actions";

export default async function NewAppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{ patientId?: string }>;
}) {
  const { patientId } = await searchParams;
  const patients = await prisma.patient.findMany({
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
  });

  return (
    <div>
      <PageHeader title="Book appointment" />
      <Card className="max-w-2xl">
        {patients.length === 0 ? (
          <p className="text-sm text-slate-600">
            No patients registered yet.{" "}
            <Link href="/patients/new" className="font-medium text-teal-700">
              Register a patient
            </Link>{" "}
            before booking an appointment.
          </p>
        ) : (
          <form action={createAppointment} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Patient *">
                <Select name="patientId" defaultValue={patientId ?? ""} required>
                  <option value="" disabled>
                    Select patient
                  </option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Doctor *">
                <Input name="doctorName" placeholder="Dr. Smith" required />
              </Field>
              <Field label="Date &amp; time *">
                <Input type="datetime-local" name="date" required />
              </Field>
              <Field label="Department">
                <Input name="department" placeholder="General, Dental, Pediatrics…" />
              </Field>
            </div>
            <Field label="Reason for visit">
              <Textarea name="reason" rows={3} />
            </Field>
            <div className="flex gap-3">
              <Button type="submit">Book appointment</Button>
              <LinkButton href="/appointments" variant="secondary">
                Cancel
              </LinkButton>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
