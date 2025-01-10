"use client";

import Footer from "@/components/Footer";
import { RoomRegistrationForm } from "@/components/Forms/RoomRegistrationForm";
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Notification, Role } from "@/constants";
import { AuthContext } from "@/contexts/AuthContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { useToast } from "@/hooks/use-toast";
import roomServiceInstance from "@/services/RoomService";
import { ApiError } from "@/types";
import { IRoom } from "@/types/Room.interface";
import { errorHandler, Filter } from "@/utils";
import { MoreHorizontalIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Salas() {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isDesktopModalOpen, setIsDesktopModalOpen] = useState(false);

  const handleModalClose = (modalType: "mobile" | "desktop") => {
    if (modalType === "mobile") {
      setIsMobileModalOpen(false);
    } else {
      setIsDesktopModalOpen(false);
    }
  };

  const [rooms, setRooms] = useState<IRoom[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const { user, isAuthenticated } = useContext(AuthContext);
  const { setIsLoading } = useContext(LoadingContext);

  const { toast } = useToast();

  const { filteredRooms, paginatedRooms, totalPages } = Filter.rooms({
    rooms,
    searchTerm,
    currentPage,
    itemsPerPage,
  });

  const handleDeleteRoom = async (roomId: number) => {
    try {
      await roomServiceInstance.deleteRoom(roomId);
      setRooms(rooms.filter((room) => room.id !== roomId));
      toast({
        title: Notification.SUCCESS.ROOM.DELETE_TITLE,
        description: Notification.SUCCESS.ROOM.DELETE_DESCRIPTION,
      });
    } catch (error) {
      const { title, description } = errorHandler(error as ApiError);
      toast({ variant: "destructive", title, description });
    }
  };

  const listRooms = async () => {
    setIsLoading(true);
    const rooms = await roomServiceInstance.listRooms();
    setRooms(rooms);
    setIsLoading(false);
  };

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) return router.push("/");
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
            <Avatar className="max-md:hidden">
              <AvatarFallback>{user?.name[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Salas</h1>
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
          <div className="md:hidden">
            <Modal
              title="Adicionar Nova Sala"
              triggerText="+"
              isOpen={isMobileModalOpen}
              onOpenChange={setIsMobileModalOpen}
            >
              <RoomRegistrationForm
                onCloseModal={() => handleModalClose("mobile")}
              />
            </Modal>
          </div>
          <div className="max-md:hidden">
            <Modal
              title="Adicionar Nova Sala"
              triggerText="+ Nova Sala"
              isOpen={isDesktopModalOpen}
              onOpenChange={setIsDesktopModalOpen}
            >
              <RoomRegistrationForm
                onCloseModal={() => handleModalClose("desktop")}
              />
            </Modal>
          </div>
        </div>
        <div className="flex gap-4 relative">
          <SearchIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
            aria-hidden="true"
          />
          <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Buscar por código, nome ou descrição"
            aria-label="Campo de busca"
          />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <GenericTable
            columns={[
              { header: "Código", accessor: "id" },
              { header: "Nome", accessor: "name" },
              { header: "Descrição", accessor: "description" },
              { header: "Capacidade", accessor: "capacity" },
              { header: "Opções", accessor: "options" },
            ]}
            data={paginatedRooms.map((room) => ({
              ...room,
              options: (
                <Dialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="w-12 h-full"
                        variant="ghost"
                        aria-label="Ações da sala"
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
                        Editar sala (em breve)
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteRoom(room.id)}
                      >
                        Deletar sala
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DialogContent className="max-md:max-w-sm rounded-sm">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">
                        Detalhes da Sala
                      </DialogTitle>
                    </DialogHeader>
                    <Separator />
                    <DialogDescription className="text-back grid grid-cols-1 grid-row-3 gap-4">
                      <div className="grid grid-cols-3 items-center justify-between">
                        <div className="flex flex-col">
                          <strong>ID</strong> {room.id}
                        </div>
                        <div className="flex flex-col">
                          <strong>Nome</strong> {room.name}
                        </div>
                        <div className="flex flex-col">
                          <strong>Capacidade</strong> {room.capacity}
                        </div>
                      </div>
                      <div>
                        <div className="flex flex-col break-words">
                          <strong>Descrição</strong>{" "}
                          {room.description || "Sem descrição"}
                        </div>
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
          Exibindo {paginatedRooms.length} de {filteredRooms.length} salas
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
