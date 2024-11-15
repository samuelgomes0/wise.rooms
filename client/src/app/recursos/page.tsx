"use client";

import GenericModal from "@/components/GenericModal";
import GenericTable from "@/components/GenericTable";
import Pagination from "@/components/Pagination";
import { ResourceRegistrationForm } from "@/components/ResourceRegistrationForm";
import SearchFilter from "@/components/SearchFilter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { resourceTypes } from "@/types/resourceTypes.enum";
import { MoreHorizontalIcon, SearchIcon } from "lucide-react";
import { useState } from "react";

export default function Recursos() {
  const [resources, setResources] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredResources = resources.filter(
    (resource) =>
      resource.id.toString().includes(searchTerm) ||
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  return (
    <div className="flex p-4 w-full">
      <main className="flex-1">
        <header className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src="https://avatars.githubusercontent.com/u/51432896?v=4"
                  alt="Avatar"
                />
                <AvatarFallback>SG</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Recursos</h1>
                <p className="text-sm text-gray-500">Administrador</p>
              </div>
            </div>
            <GenericModal
              title="Adicionar Novo Recurso"
              triggerText="+ Novo Recurso"
            >
              <ResourceRegistrationForm />
            </GenericModal>
          </div>
          <div className="flex gap-4">
            <div className="flex gap-4 relative flex-1">
              <SearchIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <SearchFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Buscar por código ou nome"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os tipos</SelectItem>
                {resourceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <GenericTable
            columns={[
              { header: "Código", accessor: "id" },
              { header: "Nome", accessor: "name" },
              { header: "Tipo", accessor: "type" },
              { header: "Quantidade", accessor: "quantity" },
              { header: "Opções", accessor: "options" },
            ]}
            data={paginatedResources.map((resource) => ({
              ...resource,
              options: (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="w-12 h-full"
                      variant="ghost"
                      aria-label="Ações do recurso"
                    >
                      <MoreHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                    <DropdownMenuItem>Editar recurso</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      Deletar recurso
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ),
            }))}
          />
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">
            Exibindo {paginatedResources.length} de {filteredResources.length}{" "}
            recursos
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </div>
  );
}
