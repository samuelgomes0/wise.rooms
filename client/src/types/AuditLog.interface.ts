interface IAuditLog {
  id: number;
  user: {
    name: string;
  };
  action: string;
  entity: string;
  resource: string;
  createdAt: string;
}

export default IAuditLog;
