import { Router, RequestHandler } from "express";
import { ContactInfoService } from "../../../application/ContactInfoService";

export function crearRutasContacto(
  service: ContactInfoService,
  authenticate: RequestHandler
): Router {
  const router = Router();

  router.get("/", async (_req, res, next) => {
    try {
      const info = await service.obtener();
      res.json(info ?? {});
    } catch (error) {
      next(error);
    }
  });

  router.put("/", authenticate, async (req, res, next) => {
    try {
      const { nombre, fotoUrl, instagram, facebook, whatsapp, tiktok, twitter, gmail, youtube } =
        req.body as Record<string, string | null | undefined>;
      const resultado = await service.upsert({
        nombre: nombre ?? "",
        fotoUrl: fotoUrl ?? "",
        instagram: instagram ?? null,
        facebook: facebook ?? null,
        whatsapp: whatsapp ?? null,
        tiktok: tiktok ?? null,
        twitter: twitter ?? null,
        gmail: gmail ?? null,
        youtube: youtube ?? null,
      });
      res.json(resultado);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
