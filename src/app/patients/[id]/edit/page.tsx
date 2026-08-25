import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader } from "@/components/ui";
import { PatientForm } from "../../PatientForm";
import { updatePatient } from "../../actions";

export default async function EditPatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patient = await prisma.patient.findUnique({ where: { id } });
  if (!patient) notFound();

  const action = updatePatient.bind(null, id);

  return (
    <div>
      <PageHeader title={`Edit ${patient.firstName} ${patient.lastName}`} />
      <Card className="max-w-2xl">
        <PatientForm action={action} patient={patient} />
      </Card>
    </div>
  );
}
