import { AuditAction, AuditEntity } from "@prisma/client";

export interface IAuditLog {
  id: number;
  user: {
    name: string;
  };
  action: string;
  entity: string;
  entityId: string;
  createdAt: Date;
}

export interface IAuditLogDTO {
  userId: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
}

export interface IAuditLogRepository {
  listAuditLogs(): Promise<IAuditLog[]>;
  createAuditLog(data: IAuditLogDTO): Promise<void>;
}
