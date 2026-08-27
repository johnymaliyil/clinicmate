import { Card, PageHeader } from "@/components/ui";
import { PatientForm } from "../PatientForm";
import { createPatient } from "../actions";

export default function NewPatientPage() {
  return (
    <div>
      <PageHeader title="Register patient" description="Add a new patient to ClinicMate" />
      <Card className="max-w-2xl">
        <PatientForm action={createPatient} />
      </Card>
    </div>
  );
}
