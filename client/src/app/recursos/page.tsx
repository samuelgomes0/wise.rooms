"use client";

import Footer from "@/components/Footer";
import { ResourceRegistrationForm } from "@/components/Forms/ResourceRegistrationForm";
import GenericTable from "@/components/GenericTable";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import SearchFilter from "@/components/SearchFilter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Notification, Role } from "@/constants";
import { AuthContext } from "@/contexts/AuthContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { useToast } from "@/hooks/use-toast";
import resourceServiceInstance from "@/services/ResourceService";
import roomServiceInstance from "@/services/RoomService";
import { ApiError, IRoom } from "@/types";
import { IResource } from "@/types/Resource.interface";
import { errorHandler, Filter } from "@/utils";
import { MoreHorizontalIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Recursos() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = async () => {
    setIsModalOpen(false);
    await listResources();
  };

  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [resources, setResources] = useState<IResource[]>([]);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const { user, isAuthenticated } = useContext(AuthContext);
  const { setIsLoading } = useContext(LoadingContext);

  const { filteredResources, paginatedResources, totalPages } =
    Filter.resources({
      resources,
      searchTerm,
      roomFilter: statusFilter,
      currentPage,
      itemsPerPage,
    });

  const listResources = async () => {
    setIsLoading(true);

    try {
      const resources = await resourceServiceInstance.listResources();
      setResources(resources);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const listRooms = async () => {
    const rooms = await roomServiceInstance.listRooms();
    setRooms(rooms);
  };

  const { toast } = useToast();

  const handleDeleteResource = async (id: number) => {
    setIsLoading(true);

    try {
      await resourceServiceInstance.deleteResource(id);
      await listResources();
      toast({
        title: Notification.SUCCESS.RESOURCE.DELETE_TITLE,
        description: Notification.SUCCESS.RESOURCE.DELETE_DESCRIPTION,
      });
    } catch (error) {
      const { title, description } = errorHandler(error as ApiError);
      toast({ variant: "destructive", title, description });
    } finally {
      setIsLoading(false);
    }
  };

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) return router.push("/");
    listResources();
    listRooms();
  }, []);

  return (
    <div
      className="pt-8 w-4/5 mx-auto flex flex-col justify-between h-screen"
      role="main"
    >
      <header className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>{user?.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Recursos</h1>
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
          <Modal
            title="Adicionar Novo Recurso"
            triggerText="+ Novo Recurso"
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
          >
            <ResourceRegistrationForm onCloseModal={handleModalClose} />
          </Modal>
        </div>
        <div className="flex gap-4">
          <div className="flex gap-4 relative flex-1">
            <SearchIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
              aria-hidden="true"
            />
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Buscar por código ou nome"
              aria-label="Campo de busca"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
            aria-label="Filtrar por sala"
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos as salas</SelectItem>
              {rooms.map((room) => (
                <SelectItem key={room.name} value={room.name}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <GenericTable
            columns={[
              { header: "Código", accessor: "id" },
              { header: "Nome", accessor: "name" },
              { header: "Alocado em", accessor: "roomName" },
              { header: "Quantidade", accessor: "quantity" },
              { header: "Opções", accessor: "options" },
            ]}
            data={paginatedResources.map((resource) => ({
              ...resource,
              options: (
                <Dialog>
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
                      <DropdownMenuItem>
                        <DialogTrigger asChild>
                          <span>Ver detalhes</span>
                        </DialogTrigger>
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled>
                        Editar recurso (em breve)
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteResource(resource.id)}
                      >
                        Deletar recurso
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-2xl">
                        Detalhes do Recurso
                      </DialogTitle>
                    </DialogHeader>
                    <Separator />
                    <DialogDescription className="text-back grid grid-cols-1 gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <strong>Código:</strong> {resource.id}
                        </div>
                        <div className="flex flex-col">
                          <strong>Nome:</strong> {resource.name}
                        </div>
                      </div>
                      <div className="flex flex-col break-words">
                        <strong>Descrição:</strong>{" "}
                        {resource.description || "Sem descrição"}
                      </div>
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              ),
            }))}
          />
        </div>
      </main>
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
      <Footer />
    </div>
  );
}
