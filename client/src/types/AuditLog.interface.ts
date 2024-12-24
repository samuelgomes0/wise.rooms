interface IAuditLog {
  id: number;
  user: {
    name: string;
  };
  action: string;
  type: string;
  entity: string;
  entityId: number;
  createdAt: string;
}

export default IAuditLog;
