import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { AuthService } from "../../application/AuthService";
import { ServicioService } from "../../application/ServicioService";
import { ContactInfoService } from "../../application/ContactInfoService";
import { CategoriaService } from "../../application/CategoriaService";
import { ReservaService } from "../../application/ReservaService";
import { BarberoService } from "../../application/BarberoService";
import { ResenaService } from "../../application/ResenaService";
import { crearAutenticacion } from "./middlewares/autenticacion";
import { manejadorErrores } from "./middlewares/manejadorErrores";
import { crearRutasAuth } from "./routes/rutasAuth";
import { crearRutasServicios } from "./routes/rutasServicios";
import { crearRutasImagenes } from "./routes/rutasImagenes";
import { crearRutasContacto } from "./routes/rutasContacto";
import { crearRutasCategorias } from "./routes/rutasCategorias";
import { crearRutasReservas } from "./routes/rutasReservas";
import { crearRutasBarberos } from "./routes/rutasBarberos";
import { crearRutasResenas } from "./routes/rutasResenas";
import { crearUploadImagenes } from "./upload/configMulter";

interface AppDependencies {
  authService: AuthService;
  servicioService: ServicioService;
  contactInfoService: ContactInfoService;
  categoriaService: CategoriaService;
  reservaService: ReservaService;
  barberoService: BarberoService;
  resenaService: ResenaService;
  uploadsDir: string;
  frontendOrigin: string;
  publicUrl: string;
}

const LOGIN_RATE_LIMIT = 10;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export function crearApp(deps: AppDependencies): Express {
  const app = express();

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(cors({ origin: deps.frontendOrigin, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  const loginLimiter = rateLimit({
    windowMs: LOGIN_WINDOW_MS,
    max: LOGIN_RATE_LIMIT,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Demasiados intentos, intenta más tarde", code: "RATE_LIMIT" },
  });
  app.use("/api/v1/auth/login", loginLimiter);

  const authenticate = crearAutenticacion(deps.authService);
  const upload = crearUploadImagenes(deps.uploadsDir);

  app.use("/api/v1/auth", crearRutasAuth(deps.authService));
  app.use("/api/v1/servicios", crearRutasServicios(deps.servicioService, authenticate));
  app.use("/api/v1/images", crearRutasImagenes(authenticate, upload, deps.publicUrl));
  app.use("/api/v1/contacto", crearRutasContacto(deps.contactInfoService, authenticate));
  app.use("/api/v1/categorias", crearRutasCategorias(deps.categoriaService, authenticate));
  app.use("/api/v1/reservas", crearRutasReservas(deps.reservaService, authenticate));
  app.use("/api/v1/barberos", crearRutasBarberos(deps.barberoService, authenticate));
  app.use("/api/v1/resenas", crearRutasResenas(deps.resenaService, authenticate));
  app.use("/uploads", express.static(deps.uploadsDir));

  app.get("/health", (_req, res) => { res.json({ status: "ok" }); });

  app.use(manejadorErrores);

  return app;
}
