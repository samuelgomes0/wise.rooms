"use client";

import GenericTable from "@/components/GenericTable";
import Pagination from "@/components/Pagination";
import { LoadingContext } from "@/contexts/LoadingContext";
import auditServiceInstance from "@/services/AuditService";
import { IAuditLog } from "@/types";
import { Filter, getActionBadge } from "@/utils";
import { useContext, useEffect, useState } from "react";

interface IAuditContentProps {
  searchTerm: string;
  actionFilter: string;
  dateFilter: Date | null;
  entityFilter: string;
}

function AuditContent({
  searchTerm,
  actionFilter,
  entityFilter,
  dateFilter,
}: IAuditContentProps) {
  const { setIsLoading } = useContext(LoadingContext);

  const [auditLogs, setAuditLogs] = useState<IAuditLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { filteredAuditLogs, paginatedAuditLogs, totalPages } =
    Filter.auditLogs({
      auditLogs,
      actionFilter,
      entityFilter,
      dateFilter,
      searchTerm,
      currentPage,
      itemsPerPage,
    });

  const listAuditLogs = async () => {
    try {
      setIsLoading(true);
      const logs = await auditServiceInstance.listAudits();
      setAuditLogs(logs);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    listAuditLogs();
  }, []);

  return (
    <>
      <main className="flex-1 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-sm">
          <GenericTable
            columns={[
              { header: "Usuário", accessor: "user" },
              { header: "Ação", accessor: "action" },
              { header: "Tipo", accessor: "type" },
              { header: "Entidade", accessor: "entityId" },
              { header: "Data", accessor: "date" },
            ]}
            data={paginatedAuditLogs.map((log: IAuditLog) => ({
              user: log.user.name,
              action: getActionBadge(log.action),
              type: log.entity,
              entityId: log.entityId,
              date: new Date(log.createdAt).toLocaleString("pt-BR"),
            }))}
          />
        </div>
      </main>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Exibindo {paginatedAuditLogs?.length || 0} de{" "}
          {filteredAuditLogs?.length || 0} logs
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}

export default AuditContent;
