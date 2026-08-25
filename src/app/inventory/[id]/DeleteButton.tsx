"use client";

import { deleteMedicine } from "../actions";

export function DeleteButton({ medicineId }: { medicineId: string }) {
  return (
    <form
      action={() => deleteMedicine(medicineId)}
      onSubmit={(e) => {
        if (!confirm("Delete this medicine and its stock history? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-700">
        Delete medicine
      </button>
    </form>
  );
}
