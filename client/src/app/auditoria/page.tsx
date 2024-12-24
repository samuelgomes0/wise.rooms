"use client";

import Footer from "@/components/Footer";
import { useState } from "react";
import AuditContent from "./AuditContent";
import AuditHeader from "./AuditHeader";

function Auditoria() {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("Todas");
  const [dateFilter, setDateFilter] = useState<Date | null>(null);

  return (
    <div className="pt-8 w-4/5 mx-auto overflow-hidden flex flex-col h-screen">
      <AuditHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        actionFilter={actionFilter}
        setActionFilter={setActionFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />
      <AuditContent
        searchTerm={searchTerm}
        actionFilter={actionFilter}
        dateFilter={dateFilter}
      />
      <Footer />
    </div>
  );
}

export default Auditoria;
