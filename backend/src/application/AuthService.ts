import { AdminRepository } from "../domain/repositories/AdminRepository";
import { HashService } from "../domain/services/HashService";
import { TokenService, TokenPayload } from "../domain/services/TokenService";
import { InvalidCredentials, InvalidToken } from "../domain/errors/DomainErrors";

export class AuthService {
  constructor(
    private readonly repository: AdminRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService
  ) {}

  async login(username: string, password: string): Promise<string> {
    const admin = await this.repository.getByUsername(username);
    if (!admin) {
      throw new InvalidCredentials();
    }
    const isPasswordValid = await this.hashService.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      throw new InvalidCredentials();
    }
    return this.tokenService.sign({ sub: admin.id, username: admin.username });
  }

  verifySession(token: string): TokenPayload {
    try {
      return this.tokenService.verify(token);
    } catch {
      throw new InvalidToken();
    }
  }
}
