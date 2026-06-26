import jwt from "jsonwebtoken";
import { TokenService, TokenPayload } from "../../domain/services/TokenService";

const EXPIRATION = "8h";

export class JwtTokenService implements TokenService {
  constructor(private readonly secret: string) {
    if (!secret || secret.length < 32) {
      throw new Error("JWT_SECRET debe tener al menos 32 caracteres");
    }
  }

  sign(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: EXPIRATION });
  }

  verify(token: string): TokenPayload {
    const decoded = jwt.verify(token, this.secret);
    if (typeof decoded === "string") {
      throw new Error("Formato de token inesperado");
    }
    return {
      sub: String(decoded.sub),
      username: String(decoded.username),
    };
  }
}
