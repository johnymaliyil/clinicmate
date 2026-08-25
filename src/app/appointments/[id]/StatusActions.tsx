"use client";

import { updateAppointmentStatus, deleteAppointment } from "../actions";
import type { AppointmentStatus } from "@prisma/client";

const options: { status: AppointmentStatus; label: string }[] = [
  { status: "SCHEDULED", label: "Scheduled" },
  { status: "COMPLETED", label: "Mark completed" },
  { status: "CANCELLED", label: "Cancel" },
  { status: "NO_SHOW", label: "No-show" },
];

export function StatusActions({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: AppointmentStatus;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {options
        .filter((o) => o.status !== currentStatus)
        .map((o) => (
          <button
            key={o.status}
            onClick={() => updateAppointmentStatus(id, o.status)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {o.label}
          </button>
        ))}
      <form
        action={() => deleteAppointment(id)}
        onSubmit={(e) => {
          if (!confirm("Delete this appointment? This cannot be undone.")) {
            e.preventDefault();
          }
        }}
      >
        <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-700">
          Delete
        </button>
      </form>
    </div>
  );
}
