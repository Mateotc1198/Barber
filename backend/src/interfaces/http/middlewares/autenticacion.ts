import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthService } from "../../../application/AuthService";

export const NOMBRE_COOKIE_SESION = "sesion_admin";

export function crearAutenticacion(authService: AuthService): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies?.[NOMBRE_COOKIE_SESION];
    if (!token) {
      res.status(401).json({ error: "No autenticado", code: "NOT_AUTHENTICATED" });
      return;
    }
    try {
      res.locals.admin = authService.verifySession(token);
      next();
    } catch {
      res.status(401).json({ error: "Sesión inválida o expirada", code: "INVALID_TOKEN" });
    }
  };
}
