import { Router, RequestHandler } from "express";
import { CategoriaService } from "../../../application/CategoriaService";

export function crearRutasCategorias(
  service: CategoriaService,
  authenticate: RequestHandler
): Router {
  const router = Router();

  router.get("/", async (_req, res, next) => {
    try {
      const categorias = await service.listar();
      res.json(categorias);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:nombre", authenticate, async (req, res, next) => {
    try {
      const { nombre } = req.params;
      const { imagenBanner, orden } = req.body as {
        imagenBanner?: string;
        orden?: number;
      };
      const resultado = await service.actualizar(nombre, {
        imagenBanner: imagenBanner ?? "",
        orden: orden ?? 0,
      });
      res.json(resultado);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
