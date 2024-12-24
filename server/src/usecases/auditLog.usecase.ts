import { IAuditLog, IAuditLogDTO } from "../interfaces/AuditLog.interface";
import { AuditLogRepository } from "../repositories";

export class AuditLogUseCase {
  private auditLogRepository: AuditLogRepository;

  constructor(auditLogRepository: AuditLogRepository) {
    this.auditLogRepository = auditLogRepository;
  }

  async listAuditLogs(): Promise<IAuditLog[]> {
    const auditLogs = await this.auditLogRepository.listAuditLogs();

    return auditLogs;
  }

  async createAuditLog({
    userId,
    action,
    entity,
    entityId,
  }: IAuditLogDTO): Promise<void> {
    if (!userId || !action || !entity || !entityId) {
      throw new Error("Missing required fields.");
    }

    await this.auditLogRepository.createAuditLog({
      userId,
      action,
      entity,
      entityId,
    });
  }
}
