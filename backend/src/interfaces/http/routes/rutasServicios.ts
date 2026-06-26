import { Router, RequestHandler } from "express";
import { ServicioService } from "../../../application/ServicioService";
import { esquemaServicio, esquemaCupos } from "../schemas/esquemasServicio";

export function crearRutasServicios(
  service: ServicioService,
  authenticate: RequestHandler
): Router {
  const router = Router();

  router.get("/", async (req, res, next) => {
    try {
      const category = typeof req.query.categoria === "string" ? req.query.categoria : undefined;
      res.json(await service.list(category));
    } catch (error) {
      next(error);
    }
  });

  router.get("/categories", async (_req, res, next) => {
    try {
      res.json(await service.listCategories());
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const servicio = await service.getById(req.params.id);
      if (!servicio) {
        res.status(404).json({ error: "Servicio no encontrado", code: "SERVICIO_NOT_FOUND" });
        return;
      }
      res.json(servicio);
    } catch (error) {
      next(error);
    }
  });

  router.post("/", authenticate, async (req, res, next) => {
    try {
      const data = esquemaServicio.parse(req.body);
      res.status(201).json(await service.create(data));
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", authenticate, async (req, res, next) => {
    try {
      const data = esquemaServicio.parse(req.body);
      res.json(await service.update(req.params.id, data));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:id/cupos", authenticate, async (req, res, next) => {
    try {
      const { cupos } = esquemaCupos.parse(req.body);
      res.json(await service.updateCupos(req.params.id, cupos));
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", authenticate, async (req, res, next) => {
    try {
      await service.delete(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  router.post("/reset", authenticate, async (_req, res, next) => {
    try {
      res.json(await service.reset());
    } catch (error) {
      next(error);
    }
  });

  return router;
}
