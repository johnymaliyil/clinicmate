import { Field, Input, Select, Textarea, Button, LinkButton } from "@/components/ui";
import type { Patient } from "@prisma/client";

export function PatientForm({
  action,
  patient,
}: {
  action: (formData: FormData) => void;
  patient?: Patient;
}) {
  const dob = patient?.dateOfBirth
    ? new Date(patient.dateOfBirth).toISOString().slice(0, 10)
    : "";

  return (
    <form action={action} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First name *">
          <Input name="firstName" defaultValue={patient?.firstName} required />
        </Field>
        <Field label="Last name *">
          <Input name="lastName" defaultValue={patient?.lastName} required />
        </Field>
        <Field label="Date of birth *">
          <Input type="date" name="dateOfBirth" defaultValue={dob} required />
        </Field>
        <Field label="Gender *">
          <Select name="gender" defaultValue={patient?.gender ?? ""} required>
            <option value="" disabled>
              Select gender
            </option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </Select>
        </Field>
        <Field label="Phone *">
          <Input name="phone" defaultValue={patient?.phone} required />
        </Field>
        <Field label="Email">
          <Input type="email" name="email" defaultValue={patient?.email ?? ""} />
        </Field>
        <Field label="Blood group">
          <Select name="bloodGroup" defaultValue={patient?.bloodGroup ?? ""}>
            <option value="">Unknown</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Address">
          <Input name="address" defaultValue={patient?.address ?? ""} />
        </Field>
      </div>
      <Field label="Allergies / notes">
        <Textarea name="allergies" defaultValue={patient?.allergies ?? ""} rows={3} />
      </Field>
      <div className="flex gap-3">
        <Button type="submit">{patient ? "Save changes" : "Register patient"}</Button>
        <LinkButton href={patient ? `/patients/${patient.id}` : "/patients"} variant="secondary">
          Cancel
        </LinkButton>
      </div>
    </form>
  );
}
