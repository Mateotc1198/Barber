import { Router, RequestHandler } from "express";
import { Multer } from "multer";
import { crearValidacionMagicBytes, subirImagenCloudinary, USE_CLOUDINARY } from "../upload/configMulter";

export function crearRutasImagenes(
  autenticacion: RequestHandler,
  upload: Multer,
  urlPublica: string
): Router {
  const router = Router();
  const validarMagicBytes = crearValidacionMagicBytes();

  router.post("/", autenticacion, upload.single("imagen"), validarMagicBytes, async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No se recibió ninguna imagen", codigo: "IMAGEN_REQUERIDA" });
      return;
    }

    if (USE_CLOUDINARY && req.file.buffer) {
      try {
        const url = await subirImagenCloudinary(req.file.buffer, req.file.mimetype);
        res.status(201).json({ url });
      } catch {
        res.status(500).json({ error: "Error al subir imagen a Cloudinary", codigo: "UPLOAD_ERROR" });
      }
      return;
    }

    res.status(201).json({ url: `${urlPublica}/uploads/${req.file.filename}` });
  });

  return router;
}
