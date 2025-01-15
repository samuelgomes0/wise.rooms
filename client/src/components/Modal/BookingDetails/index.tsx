import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getStatusBadge } from "@/utils";
import BookingInfo from "./Info";

interface BookingDetailsProps {
  isViewDetailsDialogOpen: boolean;
  booking: {
    user: {
      name: string;
    };
    room: {
      name: string;
    };
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    description: string;
  };
}

function BookingDetails({
  isViewDetailsDialogOpen,
  booking,
}: BookingDetailsProps) {
  return (
    <Dialog open={isViewDetailsDialogOpen}>
      <DialogContent className="max-md:max-w-sm rounded-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Detalhes do Agendamento
          </DialogTitle>
          <DialogDescription>
            Veja mais informações sobre o agendamento.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <BookingInfo label="Usuário" value={booking.user.name} />
            <BookingInfo label="Sala" value={booking.room.name} />
            <BookingInfo
              label="Data"
              value={new Date(booking.date).toLocaleDateString("pt-BR")}
            />
          </div>
          <div className="flex gap-4">
            <BookingInfo
              label="Horário"
              value={`${new Date(booking.startTime).toLocaleTimeString(
                "pt-BR",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )} - ${new Date(booking.endTime).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}`}
            />
            <BookingInfo
              label="Status"
              value={getStatusBadge(booking.status)}
            />
          </div>

          <BookingInfo
            label="Descrição"
            value={booking.description || "Sem descrição"}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BookingDetails;
