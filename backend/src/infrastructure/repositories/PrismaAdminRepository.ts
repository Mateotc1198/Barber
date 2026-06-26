import { PrismaClient } from "@prisma/client";
import { Admin } from "../../domain/entities/Admin";
import { AdminRepository } from "../../domain/repositories/AdminRepository";

export class PrismaAdminRepository implements AdminRepository {
  constructor(private readonly prisma: PrismaClient) {}

  getByUsername(username: string): Promise<Admin | null> {
    return this.prisma.admin.findUnique({ where: { username } });
  }
}
