import { PrismaClient } from "@prisma/client";
import { BcryptHashService } from "../security/BcryptHashService";
import { PrismaServicioRepository } from "../repositories/PrismaServicioRepository";
import { SEED_SERVICIOS } from "./seedData";

const prisma = new PrismaClient();

async function crearAdmin(): Promise<void> {
  const username = process.env.ADMIN_USUARIO ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "admin1234";
  const passwordHash = await new BcryptHashService().generate(password);
  await prisma.admin.upsert({
    where: { username },
    update: {},
    create: { username, passwordHash },
  });
  console.log(`Admin "${username}" listo`);
}

async function crearServiciosEjemplo(): Promise<void> {
  const total = await prisma.servicio.count();
  if (total > 0) {
    console.log(`Barbería con ${total} servicios — seed omitido`);
    return;
  }
  const repo = new PrismaServicioRepository(prisma);
  await repo.replaceAll(SEED_SERVICIOS);
  console.log(`${SEED_SERVICIOS.length} servicios de ejemplo creados`);
}

async function crearContactoDefault(): Promise<void> {
  const existente = await prisma.contactInfo.count();
  if (existente > 0) return;
  await prisma.contactInfo.create({
    data: {
      nombre: process.env.ADMIN_USUARIO ? "Barbería" : "BARBER",
      fotoUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80&auto=format&fit=crop",
      instagram: null,
      facebook: null,
      whatsapp: "573000000000",
      tiktok: null,
      twitter: null,
      gmail: null,
      youtube: null,
    },
  });
  console.log("Contacto por defecto creado");
}

export async function ejecutarSeed(): Promise<void> {
  try {
    await crearAdmin();
    await crearServiciosEjemplo();
    await crearContactoDefault();
  } finally {
    await prisma.$disconnect();
  }
}
