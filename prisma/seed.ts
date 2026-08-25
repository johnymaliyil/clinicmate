import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const patient1 = await prisma.patient.create({
    data: {
      firstName: "Asha",
      lastName: "Menon",
      dateOfBirth: new Date("1990-04-12"),
      gender: "Female",
      phone: "555-0101",
      email: "asha.menon@example.com",
      bloodGroup: "O+",
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      firstName: "Rahul",
      lastName: "Nair",
      dateOfBirth: new Date("1985-11-02"),
      gender: "Male",
      phone: "555-0102",
      bloodGroup: "B+",
      allergies: "Penicillin",
    },
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 30, 0, 0);

  await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorName: "Dr. Fernandez",
      department: "General Medicine",
      date: tomorrow,
      reason: "Routine checkup",
    },
  });

  await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      doctorName: "Dr. Iyer",
      department: "Dental",
      date: new Date(tomorrow.getTime() + 60 * 60 * 1000),
      reason: "Tooth pain",
    },
  });

  const paracetamol = await prisma.medicine.create({
    data: {
      name: "Paracetamol 500mg",
      category: "Analgesic",
      manufacturer: "GenPharma",
      unit: "tablets",
      quantity: 200,
      reorderLevel: 50,
      pricePerUnit: 0.05,
    },
  });

  await prisma.stockMovement.create({
    data: { medicineId: paracetamol.id, type: "RESTOCK", quantity: 200, note: "Initial stock" },
  });

  const amoxicillin = await prisma.medicine.create({
    data: {
      name: "Amoxicillin 250mg",
      category: "Antibiotic",
      manufacturer: "MediCorp",
      unit: "capsules",
      quantity: 8,
      reorderLevel: 20,
      pricePerUnit: 0.15,
      expiryDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 20),
    },
  });

  await prisma.stockMovement.create({
    data: { medicineId: amoxicillin.id, type: "RESTOCK", quantity: 8, note: "Initial stock" },
  });

  console.log("Seed data created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
