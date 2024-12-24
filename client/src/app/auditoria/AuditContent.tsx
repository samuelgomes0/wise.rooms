"use client";

import GenericTable from "@/components/GenericTable";
import Pagination from "@/components/Pagination";
import { LoadingContext } from "@/contexts/LoadingContext";
import auditServiceInstance from "@/services/AuditService";
import { IAuditLog } from "@/types";
import { Filter, getActionBadge, getEntityBadge } from "@/utils";
import { useContext, useEffect, useState } from "react";

function AuditContent({
  searchTerm,
  actionFilter,
  dateFilter,
}: {
  searchTerm: string;
  actionFilter: string;
  dateFilter: Date | null;
}) {
  const { setIsLoading } = useContext(LoadingContext);

  const [auditLogs, setAuditLogs] = useState<IAuditLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { filteredAuditLogs, paginatedAuditLogs, totalPages } =
    Filter.auditLogs({
      auditLogs,
      actionFilter,
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
      <div className="bg-white rounded-lg shadow-sm overflow-y-auto">
        <GenericTable
          columns={[
            { header: "Usuário", accessor: "user" },
            { header: "Ação", accessor: "action" },
            { header: "Entidade", accessor: "entity" },
            { header: "Data", accessor: "date" },
          ]}
          data={paginatedAuditLogs.map((log: IAuditLog) => ({
            user: log.user.name,
            action: getActionBadge(log.action),
            entity: getEntityBadge(log.entity),
            date: new Date(log.createdAt).toLocaleString("pt-BR"),
          }))}
        />
      </div>
      <div className="flex flex-col-reverse gap-4 sm:flex-row justify-between items-center mt-4">
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
