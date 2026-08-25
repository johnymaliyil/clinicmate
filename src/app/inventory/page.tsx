import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, LinkButton, Card, EmptyState, Badge } from "@/components/ui";

export default async function InventoryPage() {
  const medicines = await prisma.medicine.findMany({
    orderBy: { name: "asc" },
  });

  const lowStock = medicines.filter((m) => m.quantity <= m.reorderLevel);
  const now = new Date().getTime();

  return (
    <div>
      <PageHeader
        title="Medicine Inventory"
        description={`${medicines.length} items · ${lowStock.length} low on stock`}
        action={<LinkButton href="/inventory/new">+ Add medicine</LinkButton>}
      />

      {medicines.length === 0 ? (
        <EmptyState message="No medicines in inventory yet. Click “Add medicine” to add one." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medicines.map((m) => {
                const low = m.quantity <= m.reorderLevel;
                const expiringSoon =
                  m.expiryDate &&
                  m.expiryDate.getTime() - now < 1000 * 60 * 60 * 24 * 30;
                return (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link href={`/inventory/${m.id}`} className="hover:text-teal-700">
                        {m.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{m.category ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {m.quantity} {m.unit}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {m.expiryDate ? m.expiryDate.toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {low && <Badge tone="red">Low stock</Badge>}
                        {expiringSoon && <Badge tone="amber">Expiring soon</Badge>}
                        {!low && !expiringSoon && <Badge tone="green">OK</Badge>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
