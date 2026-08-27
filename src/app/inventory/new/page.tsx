import { Card, PageHeader } from "@/components/ui";
import { MedicineForm } from "../MedicineForm";
import { createMedicine } from "../actions";

export default function NewMedicinePage() {
  return (
    <div>
      <PageHeader title="Add medicine" description="Add a new item to the inventory" />
      <Card className="max-w-2xl">
        <MedicineForm action={createMedicine} />
      </Card>
    </div>
  );
}
