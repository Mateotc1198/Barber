import { Admin } from "../entities/Admin";

export interface AdminRepository {
  getByUsername(username: string): Promise<Admin | null>;
}
