import bcrypt from "bcryptjs";
import { HashService } from "../../domain/services/HashService";

const SALT_ROUNDS = 12;

export class BcryptHashService implements HashService {
  compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }

  generate(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, SALT_ROUNDS);
  }
}
