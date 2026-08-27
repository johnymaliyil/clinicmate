"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { AppointmentStatus } from "@prisma/client";

function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createAppointment(formData: FormData) {
  const patientId = str(formData, "patientId");
  const doctorName = str(formData, "doctorName");
  const date = str(formData, "date");

  if (!patientId || !doctorName || !date) {
    throw new Error("Please fill in all required fields.");
  }

  await prisma.appointment.create({
    data: {
      patientId,
      doctorName,
      date: new Date(date),
      department: str(formData, "department") || null,
      reason: str(formData, "reason") || null,
    },
  });

  revalidatePath("/appointments");
  revalidatePath(`/patients/${patientId}`);
  redirect("/appointments");
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/appointments");
  revalidatePath(`/appointments/${id}`);
  revalidatePath(`/patients/${appointment.patientId}`);
}

export async function deleteAppointment(id: string) {
  const appointment = await prisma.appointment.delete({ where: { id } });
  revalidatePath("/appointments");
  revalidatePath(`/patients/${appointment.patientId}`);
  redirect("/appointments");
}
