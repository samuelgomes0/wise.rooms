import { BookingRegistrationForm } from "@/components/Forms/BookingRegistrationForm";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/contexts/AuthContext";
import { capitalizeString } from "@/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useContext, useState } from "react";

interface CalendarHeaderProps {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  onBookingCreated: () => void;
}

export default function CalendarHeader({
  currentDate,
  setCurrentDate,
  onBookingCreated,
}: CalendarHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const { isAuthenticated } = useContext(AuthContext);

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    if (newDate >= oneMonthAgo) setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);

    const oneMonthAhead = new Date();
    oneMonthAhead.setMonth(oneMonthAhead.getMonth() + 1);

    if (newDate <= oneMonthAhead) setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getMonthRange = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startMonth = capitalizeString(
      startOfWeek.toLocaleString("pt-BR", { month: "long" })
    );
    const endMonth = capitalizeString(
      endOfWeek.toLocaleString("pt-BR", { month: "long" })
    );

    const startYear = currentDate.toLocaleString("pt-BR", { year: "numeric" });
    const endYear = endOfWeek.toLocaleString("pt-BR", { year: "numeric" });

    return startMonth === endMonth
      ? `${startMonth} de ${startYear}`
      : `${startMonth} de ${startYear} - ${endMonth} de ${endYear}`;
  };

  return (
    <div className="bg-white m-auto rounded py-4 px-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
      <div className="header-buttons flex gap-2 sm:gap-4 justify-center sm:justify-start w-full sm:w-auto">
        <Button size="icon" variant="outline" onClick={handlePreviousWeek}>
          <ChevronLeftIcon size={16} />
        </Button>
        <Button size="default" variant="default" onClick={handleToday}>
          Hoje
        </Button>
        <Button size="icon" variant="outline" onClick={handleNextWeek}>
          <ChevronRightIcon size={16} />
        </Button>
      </div>
      <h2 className="header-title text-lg sm:text-xl font-semibold text-center flex-1">
        {getMonthRange()}
      </h2>
      {isAuthenticated ? (
        <div className="header-modal w-full sm:w-auto flex justify-center sm:justify-end">
          <Modal
            title="Adicionar Nova Reserva"
            triggerText="+ Nova Reserva"
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
          >
            <BookingRegistrationForm
              onCloseModal={handleModalClose}
              onBookingCreated={onBookingCreated}
            />
          </Modal>
        </div>
      ) : null}
    </div>
  );
}
