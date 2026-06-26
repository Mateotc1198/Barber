import { Router, CookieOptions } from "express";
import { AuthService } from "../../../application/AuthService";
import { esquemaLogin } from "../schemas/esquemasServicio";
import { crearAutenticacion, NOMBRE_COOKIE_SESION } from "../middlewares/autenticacion";

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

function cookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DURATION_MS,
    path: "/",
  };
}

export function crearRutasAuth(authService: AuthService): Router {
  const router = Router();
  const authenticate = crearAutenticacion(authService);

  router.post("/login", async (req, res, next) => {
    try {
      const { username, password } = esquemaLogin.parse(req.body);
      const token = await authService.login(username, password);
      res.cookie(NOMBRE_COOKIE_SESION, token, cookieOptions());
      res.json({ username });
    } catch (error) {
      next(error);
    }
  });

  router.post("/logout", (_req, res) => {
    res.clearCookie(NOMBRE_COOKIE_SESION, { path: "/" });
    res.status(204).end();
  });

  router.get("/yo", authenticate, (_req, res) => {
    res.json({ username: res.locals.admin.username });
  });

  return router;
}
