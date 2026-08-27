import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, LinkButton, Card, EmptyState } from "@/components/ui";

function age(dob: Date) {
  const diff = Date.now() - dob.getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

export default async function PatientsPage() {
  const patients = await prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Patients"
        description={`${patients.length} registered patient${patients.length === 1 ? "" : "s"}`}
        action={<LinkButton href="/patients/new">+ Register patient</LinkButton>}
      />

      {patients.length === 0 ? (
        <EmptyState message="No patients registered yet. Click “Register patient” to add one." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Age / Gender</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Blood Group</th>
                <th className="px-4 py-3">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link href={`/patients/${p.id}`} className="hover:text-teal-700">
                      {p.firstName} {p.lastName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {age(p.dateOfBirth)} yrs, {p.gender}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.phone}</td>
                  <td className="px-4 py-3 text-slate-600">{p.bloodGroup ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {p.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
