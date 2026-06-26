import { Router, RequestHandler } from "express";
import { Multer } from "multer";
import { crearValidacionMagicBytes } from "../upload/configMulter";

export function crearRutasImagenes(
  autenticacion: RequestHandler,
  upload: Multer,
  urlPublica: string
): Router {
  const router = Router();
  const validarMagicBytes = crearValidacionMagicBytes();

  router.post("/", autenticacion, upload.single("imagen"), validarMagicBytes, (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No se recibió ninguna imagen", codigo: "IMAGEN_REQUERIDA" });
      return;
    }
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });

  void urlPublica;
  return router;
}
