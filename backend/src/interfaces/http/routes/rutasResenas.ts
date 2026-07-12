import { Router, RequestHandler } from "express";
import { z } from "zod";
import { ResenaService } from "../../../application/ResenaService";

const esquemaResena = z.object({
  barberoId: z.string().min(1),
  nombreCliente: z.string().min(1).max(100),
  calificacion: z.number().int().min(1).max(5),
  comentario: z.string().max(500).optional(),
});

export function crearRutasResenas(service: ResenaService, authenticate: RequestHandler): Router {
  const router = Router();

  router.get("/", async (req, res, next) => {
    try {
      const barberoId = String(req.query.barberoId ?? "");
      if (!barberoId) { res.status(400).json({ error: "Falta barberoId" }); return; }
      res.json(await service.listarPorBarbero(barberoId));
    } catch (e) { next(e); }
  });

  router.post("/", async (req, res, next) => {
    try { res.status(201).json(await service.crear(esquemaResena.parse(req.body))); } catch (e) { next(e); }
  });

  router.delete("/:id", authenticate, async (req, res, next) => {
    try { await service.eliminar(req.params.id); res.status(204).end(); } catch (e) { next(e); }
  });

  return router;
}
