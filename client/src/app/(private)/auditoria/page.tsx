"use client";

import Footer from "@/components/Footer";
import { useState } from "react";
import AuditContent from "./AuditContent";
import AuditHeader from "./AuditHeader";

function Auditoria() {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("Todas");
  const [entityFilter, setEntityFilter] = useState("Todas");
  const [dateFilter, setDateFilter] = useState<Date | null>(null);

  return (
    <div className="pt-8 w-4/5 mx-auto flex flex-col justify-between h-screen">
      <AuditHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        actionFilter={actionFilter}
        setActionFilter={setActionFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        entityFilter={entityFilter}
        setEntityFilter={setEntityFilter}
      />
      <AuditContent
        searchTerm={searchTerm}
        actionFilter={actionFilter}
        dateFilter={dateFilter}
        entityFilter={entityFilter}
      />
      <Footer />
    </div>
  );
}

export default Auditoria;
