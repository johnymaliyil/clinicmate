"use client";

import { deletePatient } from "../actions";

export function DeleteButton({ patientId }: { patientId: string }) {
  return (
    <form
      action={() => deletePatient(patientId)}
      onSubmit={(e) => {
        if (!confirm("Delete this patient and all their appointments? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="text-sm font-medium text-red-600 hover:text-red-700"
      >
        Delete patient
      </button>
    </form>
  );
}
