"use client";

import Footer from "@/components/Footer";
import { BookingRegistrationForm } from "@/components/Forms/BookingRegistrationForm";
import GenericTable from "@/components/GenericTable";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import SearchFilter from "@/components/SearchFilter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Notification, Role } from "@/constants";
import { AuthContext } from "@/contexts/AuthContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { useToast } from "@/hooks/use-toast";
import bookingServiceInstance from "@/services/BookingService";
import { ApiError, IBooking } from "@/types";
import { errorHandler, Filter, getStatusBadge } from "@/utils";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CalendarIcon,
  CircleCheckIcon,
  MoreHorizontalIcon,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function MinhasReservas() {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isDesktopModalOpen, setIsDesktopModalOpen] = useState(false);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const { toast } = useToast();
  const { user, isAuthenticated } = useContext(AuthContext);
  const { setIsLoading } = useContext(LoadingContext);

  const { filteredBookings, paginatedBookings, totalPages } = Filter.bookings({
    bookings,
    searchTerm,
    statusFilter,
    dateFilter,
    currentPage,
    itemsPerPage,
  });

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) return router.push("/");
    listBookings();
  }, []);

  const listBookings = async () => {
    setIsLoading(true);
    try {
      const data = await bookingServiceInstance.findBookingsByUser(user?.id);
      setBookings(data);
    } catch (error) {
      console.error("Error listing bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingServiceInstance.cancelBooking(bookingId);
      await listBookings();
      toast({
        title: Notification.SUCCESS.BOOKING.CANCEL_TITLE,
        description: Notification.SUCCESS.BOOKING.CANCEL_DESCRIPTION,
      });
    } catch (error) {
      const { title, description } = errorHandler(error as ApiError);
      toast({ variant: "destructive", title, description });
    }
  };

  const handleModalClose = (modalType: "mobile" | "desktop") => {
    if (modalType === "mobile") {
      setIsMobileModalOpen(false);
    } else {
      setIsDesktopModalOpen(false);
    }
    listBookings();
  };

  return (
    <div
      className="pt-8 w-4/5 mx-auto flex flex-col justify-between h-screen"
      role="main"
    >
      <header className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4 sm:flex-row">
            <Avatar className="max-md:hidden">
              <AvatarFallback>{user?.name[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Minhas Reservas</h1>
              <div className="text-sm text-gray-500">
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
              title="Adicionar Nova Reserva"
              triggerText="+"
              isOpen={isMobileModalOpen}
              onOpenChange={setIsMobileModalOpen}
            >
              <BookingRegistrationForm
                onCloseModal={() => handleModalClose("mobile")}
                onBookingCreated={listBookings}
              />
            </Modal>
          </div>
          <div className="max-md:hidden">
            <Modal
              title="Adicionar Nova Reserva"
              triggerText="+ Nova Reserva"
              isOpen={isDesktopModalOpen}
              onOpenChange={setIsDesktopModalOpen}
            >
              <BookingRegistrationForm
                onCloseModal={() => handleModalClose("desktop")}
                onBookingCreated={listBookings}
              />
            </Modal>
          </div>
        </div>
        <div className="flex gap-2 max-md:flex-col">
          <div className="flex-1 flex gap-4 relative">
            <SearchIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
              aria-hidden="true"
            />
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Buscar por sala"
              aria-label="Campo de busca"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 justify-start text-left font-normal text-gray-600"
                aria-label="Filtrar por data"
              >
                {dateFilter ? (
                  format(dateFilter, "PPP", { locale: ptBR })
                ) : (
                  <span>Selecione uma data</span>
                )}
                <CalendarIcon className="ml-auto opacity-50" size={18} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
                initialFocus
                locale={ptBR}
                aria-label="Calendário de seleção de data"
              />
            </PopoverContent>
          </Popover>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
            aria-label="Filtrar por status"
          >
            <SelectTrigger className="flex-1 justify-start text-left font-normal text-gray-600">
              <CircleCheckIcon className="mr-3 text-gray-400" size={18} />
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos os status</SelectItem>
              <SelectItem value="PENDING">Pendente</SelectItem>
              <SelectItem value="CONFIRMED">Confirmado</SelectItem>
              <SelectItem value="ACTIVE">Ativo</SelectItem>
              <SelectItem value="COMPLETED">Concluído</SelectItem>
              <SelectItem value="CANCELLED">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-sm">
          <GenericTable
            columns={[
              { header: "Sala", accessor: "room" },
              { header: "Início", accessor: "startTime" },
              { header: "Fim", accessor: "endTime" },
              { header: "Data", accessor: "date" },
              { header: "Status", accessor: "status" },
              { header: "Opções", accessor: "options" },
            ]}
            data={paginatedBookings.map((booking: IBooking) => ({
              ...booking,
              room: booking.room.name,
              date: format(booking.date, "dd/MM/yyyy"),
              startTime: format(
                parseISO(booking.startTime.toString()),
                "HH:mm"
              ),
              endTime: format(parseISO(booking.endTime.toString()), "HH:mm"),
              status: getStatusBadge(booking.status),
              options: (
                <Dialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="w-12 h-full"
                        variant="ghost"
                        aria-label="Ações da reserva"
                      >
                        <MoreHorizontalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <DialogTrigger>Ver detalhes</DialogTrigger>
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled>
                        Editar reserva (em breve)
                      </DropdownMenuItem>
                      {booking.status !== "CANCELLED" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancelar reserva
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DialogContent className="max-md:max-w-sm rounded-sm">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">
                        Detalhes do Agendamento
                      </DialogTitle>
                    </DialogHeader>
                    <Separator />
                    <DialogDescription className="text-back grid grid-cols-1 grid-row-3 gap-4">
                      <div className="grid grid-cols-3 items-center justify-between">
                        <div className="flex flex-col">
                          <strong>Sala</strong> {booking.room.name}
                        </div>
                        <div className="flex flex-col">
                          <strong>Data</strong>{" "}
                          {new Date(booking.date).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                      <div className="grid grid-cols-3">
                        <div className="flex flex-col">
                          <strong>Horário</strong>{" "}
                          {new Date(booking.startTime).toLocaleTimeString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}{" "}
                          -{" "}
                          {new Date(booking.endTime).toLocaleTimeString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                        <div className="grid gap-1 w-2/4">
                          <strong>Status</strong>{" "}
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>
                      <div>
                        <div className="flex flex-col break-words">
                          <strong>Descrição</strong>{" "}
                          {booking.description || "Sem descrição"}
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
      <div className="flex flex-col-reverse gap-4 sm:flex-row justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Exibindo {paginatedBookings.length} de {filteredBookings.length}{" "}
          reservas
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
