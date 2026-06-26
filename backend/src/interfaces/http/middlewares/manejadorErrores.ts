import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { MulterError } from "multer";
import { DomainError } from "../../../domain/errors/DomainErrors";

const STATUS_BY_CODE: Record<string, number> = {
  SERVICIO_NOT_FOUND: 404,
  INVALID_CREDENTIALS: 401,
  INVALID_TOKEN: 401,
};

export function manejadorErrores(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof DomainError) {
    const status = STATUS_BY_CODE[err.code] ?? 400;
    res.status(status).json({ error: err.message, code: err.code });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Datos de entrada inválidos",
      code: "VALIDATION_ERROR",
      details: err.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    });
    return;
  }

  if (err instanceof MulterError) {
    res.status(400).json({ error: `Error al subir archivo: ${err.message}`, code: "UPLOAD_ERROR" });
    return;
  }

  console.error("Error no controlado:", err);
  res.status(500).json({ error: "Error interno del servidor", code: "INTERNAL_ERROR" });
}
