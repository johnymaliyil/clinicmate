import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader } from "@/components/ui";
import { MedicineForm } from "../../MedicineForm";
import { updateMedicine } from "../../actions";

export default async function EditMedicinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const medicine = await prisma.medicine.findUnique({ where: { id } });
  if (!medicine) notFound();

  const action = updateMedicine.bind(null, id);

  return (
    <div>
      <PageHeader title={`Edit ${medicine.name}`} />
      <Card className="max-w-2xl">
        <MedicineForm action={action} medicine={medicine} />
      </Card>
    </div>
  );
}
