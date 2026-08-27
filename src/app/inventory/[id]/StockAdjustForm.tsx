"use client";

import { useRef } from "react";
import { adjustStock } from "../actions";
import { Field, Input, Select, Button } from "@/components/ui";

export function StockAdjustForm({ medicineId }: { medicineId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = adjustStock.bind(null, medicineId);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await action(formData);
        formRef.current?.reset();
      }}
      className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-end"
    >
      <Field label="Action">
        <Select name="type" defaultValue="RESTOCK">
          <option value="RESTOCK">Restock (add)</option>
          <option value="DISPENSE">Dispense (remove)</option>
          <option value="ADJUSTMENT">Adjustment (add)</option>
        </Select>
      </Field>
      <Field label="Quantity">
        <Input type="number" name="quantity" min={1} required />
      </Field>
      <Field label="Note">
        <Input name="note" placeholder="Optional" />
      </Field>
      <Button type="submit">Update stock</Button>
    </form>
  );
}
