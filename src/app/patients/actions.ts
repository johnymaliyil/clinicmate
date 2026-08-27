"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createPatient(formData: FormData) {
  const firstName = str(formData, "firstName");
  const lastName = str(formData, "lastName");
  const dateOfBirth = str(formData, "dateOfBirth");
  const gender = str(formData, "gender");
  const phone = str(formData, "phone");

  if (!firstName || !lastName || !dateOfBirth || !gender || !phone) {
    throw new Error("Please fill in all required fields.");
  }

  const patient = await prisma.patient.create({
    data: {
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      phone,
      email: str(formData, "email") || null,
      address: str(formData, "address") || null,
      bloodGroup: str(formData, "bloodGroup") || null,
      allergies: str(formData, "allergies") || null,
    },
  });

  revalidatePath("/patients");
  redirect(`/patients/${patient.id}`);
}

export async function updatePatient(id: string, formData: FormData) {
  const firstName = str(formData, "firstName");
  const lastName = str(formData, "lastName");
  const dateOfBirth = str(formData, "dateOfBirth");
  const gender = str(formData, "gender");
  const phone = str(formData, "phone");

  if (!firstName || !lastName || !dateOfBirth || !gender || !phone) {
    throw new Error("Please fill in all required fields.");
  }

  await prisma.patient.update({
    where: { id },
    data: {
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      phone,
      email: str(formData, "email") || null,
      address: str(formData, "address") || null,
      bloodGroup: str(formData, "bloodGroup") || null,
      allergies: str(formData, "allergies") || null,
    },
  });

  revalidatePath("/patients");
  revalidatePath(`/patients/${id}`);
  redirect(`/patients/${id}`);
}

export async function deletePatient(id: string) {
  await prisma.patient.delete({ where: { id } });
  revalidatePath("/patients");
  redirect("/patients");
}
