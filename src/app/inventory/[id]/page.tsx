import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader, LinkButton, Badge } from "@/components/ui";
import { StockAdjustForm } from "./StockAdjustForm";
import { DeleteButton } from "./DeleteButton";

export default async function MedicineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const medicine = await prisma.medicine.findUnique({
    where: { id },
    include: { movements: { orderBy: { createdAt: "desc" }, take: 20 } },
  });

  if (!medicine) notFound();

  const low = medicine.quantity <= medicine.reorderLevel;

  return (
    <div className="space-y-6">
      <PageHeader
        title={medicine.name}
        description={`${medicine.quantity} ${medicine.unit} in stock`}
        action={
          <div className="flex items-center gap-3">
            {low && <Badge tone="red">Low stock</Badge>}
            <LinkButton href={`/inventory/${medicine.id}/edit`} variant="secondary">
              Edit
            </LinkButton>
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
              <dt className="text-slate-500">Category</dt>
              <dd className="font-medium text-slate-900">{medicine.category ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Manufacturer</dt>
              <dd className="font-medium text-slate-900">{medicine.manufacturer ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Reorder level</dt>
              <dd className="font-medium text-slate-900">
                {medicine.reorderLevel} {medicine.unit}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Price per unit</dt>
              <dd className="font-medium text-slate-900">
                {medicine.pricePerUnit != null ? `$${medicine.pricePerUnit.toFixed(2)}` : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Expiry date</dt>
              <dd className="font-medium text-slate-900">
                {medicine.expiryDate ? medicine.expiryDate.toLocaleDateString() : "—"}
              </dd>
            </div>
          </dl>
          <div className="mt-6 border-t border-slate-100 pt-4">
            <DeleteButton medicineId={medicine.id} />
          </div>
        </Card>

        <Card className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Adjust stock
            </h2>
            <StockAdjustForm medicineId={medicine.id} />
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Recent movements
            </h2>
            {medicine.movements.length === 0 ? (
              <p className="text-sm text-slate-500">No stock movements recorded yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100 text-sm">
                {medicine.movements.map((m) => (
                  <li key={m.id} className="flex items-center justify-between py-2">
                    <div>
                      <span className="font-medium text-slate-900">{m.type}</span>{" "}
                      <span className="text-slate-500">
                        {m.createdAt.toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                      {m.note && <p className="text-slate-500">{m.note}</p>}
                    </div>
                    <span className={m.quantity < 0 ? "text-red-600" : "text-emerald-600"}>
                      {m.quantity > 0 ? "+" : ""}
                      {m.quantity} {medicine.unit}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
