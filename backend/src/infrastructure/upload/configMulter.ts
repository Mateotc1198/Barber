import multer from "multer";
import crypto from "crypto";
import fs from "fs";
import { RequestHandler, Request, Response, NextFunction } from "express";
import { DomainError } from "../../domain/errors/DomainErrors";

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

const MAGIC_BYTES: Record<string, (b: Buffer) => boolean> = {
  "image/jpeg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/png": (b) =>
    b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
    b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a,
  "image/webp": (b) =>
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  "image/avif": (b) =>
    b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70,
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export function crearUploadImagenes(directory: string) {
  const storage = multer.diskStorage({
    destination: directory,
    filename: (_req, file, cb) => {
      cb(null, crypto.randomUUID() + EXTENSION_BY_MIME[file.mimetype]);
    },
  });

  return multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 },
    fileFilter: (_req, file, cb) => {
      if (EXTENSION_BY_MIME[file.mimetype]) {
        cb(null, true);
      } else {
        cb(new DomainError("Tipo de imagen no permitido (JPEG, PNG, WebP o AVIF)", "INVALID_IMAGE_TYPE"));
      }
    },
  });
}

export function crearValidacionMagicBytes(): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const file = req.file;
    if (!file) {
      next();
      return;
    }

    let buf: Buffer;
    try {
      const fd = fs.openSync(file.path, "r");
      buf = Buffer.alloc(12);
      fs.readSync(fd, buf, 0, 12, 0);
      fs.closeSync(fd);
    } catch {
      next(new DomainError("No se pudo leer el archivo subido", "FILE_READ_ERROR"));
      return;
    }

    const check = MAGIC_BYTES[file.mimetype];
    if (!check || !check(buf)) {
      try { fs.unlinkSync(file.path); } catch { /* ignorar */ }
      next(new DomainError("El contenido del archivo no coincide con su tipo declarado", "INVALID_IMAGE_CONTENT"));
      return;
    }

    next();
  };
}
