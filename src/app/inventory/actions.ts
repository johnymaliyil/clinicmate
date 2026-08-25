"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createMedicine(formData: FormData) {
  const name = str(formData, "name");
  if (!name) throw new Error("Medicine name is required.");

  const quantity = Number(str(formData, "quantity") || "0");
  const reorderLevel = Number(str(formData, "reorderLevel") || "10");
  const pricePerUnit = str(formData, "pricePerUnit");
  const expiryDate = str(formData, "expiryDate");

  const medicine = await prisma.medicine.create({
    data: {
      name,
      category: str(formData, "category") || null,
      manufacturer: str(formData, "manufacturer") || null,
      unit: str(formData, "unit") || "units",
      quantity,
      reorderLevel,
      pricePerUnit: pricePerUnit ? Number(pricePerUnit) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    },
  });

  if (quantity > 0) {
    await prisma.stockMovement.create({
      data: {
        medicineId: medicine.id,
        type: "RESTOCK",
        quantity,
        note: "Initial stock",
      },
    });
  }

  revalidatePath("/inventory");
  redirect(`/inventory/${medicine.id}`);
}

export async function updateMedicine(id: string, formData: FormData) {
  const name = str(formData, "name");
  if (!name) throw new Error("Medicine name is required.");

  const reorderLevel = Number(str(formData, "reorderLevel") || "10");
  const pricePerUnit = str(formData, "pricePerUnit");
  const expiryDate = str(formData, "expiryDate");

  await prisma.medicine.update({
    where: { id },
    data: {
      name,
      category: str(formData, "category") || null,
      manufacturer: str(formData, "manufacturer") || null,
      unit: str(formData, "unit") || "units",
      reorderLevel,
      pricePerUnit: pricePerUnit ? Number(pricePerUnit) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    },
  });

  revalidatePath("/inventory");
  revalidatePath(`/inventory/${id}`);
  redirect(`/inventory/${id}`);
}

export async function adjustStock(id: string, formData: FormData) {
  const type = str(formData, "type") as "RESTOCK" | "DISPENSE" | "ADJUSTMENT";
  const amount = Number(str(formData, "quantity") || "0");
  const note = str(formData, "note") || null;

  if (!amount || amount <= 0) {
    throw new Error("Enter a quantity greater than zero.");
  }

  const medicine = await prisma.medicine.findUniqueOrThrow({ where: { id } });
  const delta = type === "DISPENSE" ? -amount : amount;
  const newQuantity = medicine.quantity + delta;

  if (newQuantity < 0) {
    throw new Error("Not enough stock on hand for this dispense.");
  }

  await prisma.$transaction([
    prisma.medicine.update({
      where: { id },
      data: { quantity: newQuantity },
    }),
    prisma.stockMovement.create({
      data: { medicineId: id, type, quantity: delta, note },
    }),
  ]);

  revalidatePath("/inventory");
  revalidatePath(`/inventory/${id}`);
}

export async function deleteMedicine(id: string) {
  await prisma.medicine.delete({ where: { id } });
  revalidatePath("/inventory");
  redirect("/inventory");
}
