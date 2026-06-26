import { Router, RequestHandler } from "express";
import { z } from "zod";
import { BarberoService } from "../../../application/BarberoService";

const esquemaBarbero = z.object({
  nombre: z.string().min(1).max(100),
  fotoUrl: z.string().optional(),
  descripcion: z.string().max(500).optional(),
  activo: z.boolean().optional(),
  orden: z.number().int().optional(),
});

export function crearRutasBarberos(service: BarberoService, authenticate: RequestHandler): Router {
  const router = Router();

  router.get("/", async (_req, res, next) => {
    try { res.json(await service.listar()); } catch (e) { next(e); }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const b = await service.getById(req.params.id);
      if (!b) { res.status(404).json({ error: "Barbero no encontrado" }); return; }
      res.json(b);
    } catch (e) { next(e); }
  });

  router.post("/", authenticate, async (req, res, next) => {
    try { res.status(201).json(await service.crear(esquemaBarbero.parse(req.body))); } catch (e) { next(e); }
  });

  router.put("/:id", authenticate, async (req, res, next) => {
    try { res.json(await service.actualizar(req.params.id, esquemaBarbero.parse(req.body))); } catch (e) { next(e); }
  });

  router.delete("/:id", authenticate, async (req, res, next) => {
    try { await service.eliminar(req.params.id); res.status(204).end(); } catch (e) { next(e); }
  });

  return router;
}
