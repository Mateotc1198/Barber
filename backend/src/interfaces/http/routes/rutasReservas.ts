import { Router, RequestHandler } from "express";
import { z } from "zod";
import { ReservaService } from "../../../application/ReservaService";

const esquemaReserva = z.object({
  servicioId: z.string().min(1).optional(),
  barberoId: z.string().optional(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato fecha: YYYY-MM-DD"),
  hora: z.string().regex(/^\d{2}:\d{2}$/, "Formato hora: HH:MM"),
  nombre: z.string().min(1).max(100),
  telefono: z.string().max(20).optional(),
});

export function crearRutasReservas(service: ReservaService, authenticate: RequestHandler): Router {
  const router = Router();

  router.get("/disponibilidad", async (req, res, next) => {
    try {
      const { servicioId, fecha, barberoId } = req.query;
      if (typeof fecha !== "string" || typeof barberoId !== "string") {
        res.status(400).json({ error: "fecha y barberoId son requeridos", code: "VALIDATION_ERROR" });
        return;
      }
      const slots = await service.obtenerDisponibilidad(fecha, barberoId, typeof servicioId === "string" ? servicioId : undefined);
      res.json(slots);
    } catch (error) {
      next(error);
    }
  });

  router.get("/", authenticate, async (req, res, next) => {
    try {
      const fecha = typeof req.query.fecha === "string" ? req.query.fecha : new Date().toISOString().slice(0, 10);
      res.json(await service.listarPorFecha(fecha));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:id/cancelar", authenticate, async (req, res, next) => {
    try {
      await service.cancelar(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const data = esquemaReserva.parse(req.body);
      const reserva = await service.crear(data);
      res.status(201).json(reserva);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
