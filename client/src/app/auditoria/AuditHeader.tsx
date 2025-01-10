"use client";

import SearchFilter from "@/components/SearchFilter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Role } from "@/constants";
import { AuthContext } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, FilterIcon, SearchIcon } from "lucide-react";
import { useContext } from "react";

interface AuditHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  actionFilter: string;
  setActionFilter: (value: string) => void;
  dateFilter: Date | null;
  setDateFilter: (value: Date | null) => void;
  entityFilter: string;
  setEntityFilter: (value: string) => void;
}

function AuditHeader({
  searchTerm,
  setSearchTerm,
  actionFilter,
  setActionFilter,
  dateFilter,
  setDateFilter,
  entityFilter,
  setEntityFilter,
}: AuditHeaderProps) {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4 sm:flex-row">
          <Avatar className="max-md:hidden">
            <AvatarFallback>{user?.name[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Auditoria</h1>
            <div className="text-sm text-read">
              {user?.role.name ? (
                <span>
                  {Role.label[user.role.name as keyof typeof Role.label]}
                </span>
              ) : (
                <Skeleton className="w-24 h-3" />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 relative">
        <SearchIcon
          className="absolute left-4 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Buscar por usuário"
        />
        <div className="relative">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="sm:w-[200px] w-full justify-start text-left font-normal text-gray-600"
              >
                {dateFilter ? (
                  format(dateFilter, "PPP", { locale: ptBR })
                ) : (
                  <span className="hidden sm:block">Selecione uma data</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="relative">
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="sm:w-[200px] w-full justify-start text-left font-normal text-gray-600">
              <FilterIcon
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas as ações</SelectItem>
              <SelectItem value="CREATE">Criar</SelectItem>
              <SelectItem value="UPDATE">Atualizar</SelectItem>
              <SelectItem value="DELETE">Deletar</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="sm:w-[200px] w-full justify-start text-left font-normal text-gray-600">
              <FilterIcon
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas as entidades</SelectItem>
              <SelectItem value="USER">Usuário</SelectItem>
              <SelectItem value="ROOM">Sala</SelectItem>
              <SelectItem value="RESOURCE">Recurso</SelectItem>
              <SelectItem value="BOOKING">Reserva</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}

export default AuditHeader;
