import { prisma } from "../database/prisma-client";
import { IAuditLog, IAuditLogDTO, IAuditLogRepository } from "../interfaces";

export class AuditLogRepository implements IAuditLogRepository {
  async listAuditLogs(): Promise<IAuditLog[]> {
    return await prisma.auditLog.findMany({
      select: {
        id: true,
        user: {
          select: {
            name: true,
          },
        },
        action: true,
        entity: true,
        entityId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async createAuditLog({
    userId,
    action,
    entity,
    entityId,
  }: IAuditLogDTO): Promise<void> {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
      },
    });
  }
}
