import { Field, Input, Button, LinkButton } from "@/components/ui";
import type { Medicine } from "@prisma/client";

export function MedicineForm({
  action,
  medicine,
}: {
  action: (formData: FormData) => void;
  medicine?: Medicine;
}) {
  const expiry = medicine?.expiryDate
    ? new Date(medicine.expiryDate).toISOString().slice(0, 10)
    : "";

  return (
    <form action={action} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name *">
          <Input name="name" defaultValue={medicine?.name} required />
        </Field>
        <Field label="Category">
          <Input name="category" defaultValue={medicine?.category ?? ""} placeholder="Analgesic, Antibiotic…" />
        </Field>
        <Field label="Manufacturer">
          <Input name="manufacturer" defaultValue={medicine?.manufacturer ?? ""} />
        </Field>
        <Field label="Unit">
          <Input name="unit" defaultValue={medicine?.unit ?? "units"} placeholder="tablets, ml, boxes…" />
        </Field>
        {!medicine && (
          <Field label="Initial stock quantity">
            <Input type="number" min={0} name="quantity" defaultValue={0} />
          </Field>
        )}
        <Field label="Reorder level">
          <Input type="number" min={0} name="reorderLevel" defaultValue={medicine?.reorderLevel ?? 10} />
        </Field>
        <Field label="Price per unit">
          <Input type="number" min={0} step="0.01" name="pricePerUnit" defaultValue={medicine?.pricePerUnit ?? ""} />
        </Field>
        <Field label="Expiry date">
          <Input type="date" name="expiryDate" defaultValue={expiry} />
        </Field>
      </div>
      <div className="flex gap-3">
        <Button type="submit">{medicine ? "Save changes" : "Add medicine"}</Button>
        <LinkButton href={medicine ? `/inventory/${medicine.id}` : "/inventory"} variant="secondary">
          Cancel
        </LinkButton>
      </div>
    </form>
  );
}
