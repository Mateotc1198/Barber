import "dotenv/config";
import fs from "fs";
import path from "path";
import { clientePrisma } from "./infrastructure/db/clientePrisma";
import { PrismaServicioRepository } from "./infrastructure/repositories/PrismaServicioRepository";
import { PrismaReservaRepository } from "./infrastructure/repositories/PrismaReservaRepository";
import { PrismaBarberoRepository } from "./infrastructure/repositories/PrismaBarberoRepository";
import { PrismaAdminRepository } from "./infrastructure/repositories/PrismaAdminRepository";
import { PrismaContactInfoRepository } from "./infrastructure/repositories/PrismaContactInfoRepository";
import { PrismaCategoriaRepository } from "./infrastructure/repositories/PrismaCategoriaRepository";
import { BcryptHashService } from "./infrastructure/security/BcryptHashService";
import { JwtTokenService } from "./infrastructure/security/JwtTokenService";
import { SEED_SERVICIOS } from "./infrastructure/seed/seedData";
import { ServicioService } from "./application/ServicioService";
import { AuthService } from "./application/AuthService";
import { ContactInfoService } from "./application/ContactInfoService";
import { CategoriaService } from "./application/CategoriaService";
import { ReservaService } from "./application/ReservaService";
import { BarberoService } from "./application/BarberoService";
import { crearApp } from "./interfaces/http/app";

const PORT = Number(process.env.PORT ?? 4000);
const FRONTEND_ORIGIN = process.env.ORIGEN_FRONTEND ?? "http://localhost:3000";
const PUBLIC_URL = process.env.URL_PUBLICA ?? `http://localhost:${PORT}`;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw new Error("Falta la variable de entorno JWT_SECRET");

const uploadsDir = path.resolve(process.cwd(), "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

async function iniciar() {
  const prismaServicioRepo = new PrismaServicioRepository(clientePrisma);
  const prismaBarberoRepo = new PrismaBarberoRepository(clientePrisma);
  const barberoService = new BarberoService(prismaBarberoRepo);

  await barberoService.seedInicial([
    { nombre: "Han Vidal", descripcion: "Especialista en fades y cortes modernos.", orden: 1 },
    { nombre: "Barbero 2", descripcion: "Experto en barba y tratamientos capilares.", orden: 2 },
  ]);

  const app = crearApp({
    authService: new AuthService(
      new PrismaAdminRepository(clientePrisma),
      new BcryptHashService(),
      new JwtTokenService(JWT_SECRET!)
    ),
    servicioService: new ServicioService(prismaServicioRepo, SEED_SERVICIOS),
    contactInfoService: new ContactInfoService(new PrismaContactInfoRepository(clientePrisma)),
    categoriaService: new CategoriaService(new PrismaCategoriaRepository(clientePrisma), prismaServicioRepo),
    reservaService: new ReservaService(new PrismaReservaRepository(clientePrisma), prismaServicioRepo, prismaBarberoRepo),
    barberoService,
    uploadsDir,
    frontendOrigin: FRONTEND_ORIGIN,
    publicUrl: PUBLIC_URL,
  });

  app.listen(PORT, () => {
    console.log(`API Barbería corriendo en http://localhost:${PORT}`);
  });
}

iniciar().catch((e) => { console.error(e); process.exit(1); });
