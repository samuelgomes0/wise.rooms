import { IAuditLog } from "@/types";
import apiServiceInstance from "./ApiService";

interface AuditDTO {
  userId: string;
  action: string;
  date: Date | string;
  description?: string;
}

class AuditService {
  async listAudits(): Promise<IAuditLog[]> {
    const audits = await apiServiceInstance.get<IAuditLog[]>("/auditLogs");
    return audits.data;
  }

  async findAuditsByUser(userId: string): Promise<IAuditLog[]> {
    const audits = await apiServiceInstance.get<IAuditLog[]>(
      `/auditLogs/user/${userId}`
    );
    return audits.data;
  }

  async createAudit({ userId, action, date, description }: AuditDTO) {
    return await apiServiceInstance.post<void, AuditDTO>("/auditLogs", {
      userId,
      action,
      date,
      description,
    });
  }
}

const auditServiceInstance = new AuditService();
export default auditServiceInstance;
