import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_TIME_SLOTS } from "@/constants";
import { IBooking } from "@/types";
import { attributeColorToRoom, getStatusBadge } from "@/utils";
import { ChevronLeft, ChevronRight, ZoomInIcon } from "lucide-react";
import React, { useState } from "react";
import Header from "./Header";

interface WeeklyViewProps {
  startDate: Date;
  bookings: IBooking[];
}

export function WeeklyView({ startDate, bookings }: WeeklyViewProps) {
  const adjustedStartDate = new Date(startDate);
  const dayOfWeek = adjustedStartDate.getDay();
  adjustedStartDate.setDate(adjustedStartDate.getDate() - dayOfWeek);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(adjustedStartDate);
    day.setDate(adjustedStartDate.getDate() + i);
    return day;
  });

  const today = new Date();
  const todayIndex = weekDays.findIndex(
    (day) => day.toDateString() === today.toDateString()
  );

  const [currentDayIndex, setCurrentDayIndex] = useState(
    todayIndex >= 0 ? todayIndex : 0
  );

  const filteredBookings = bookings.filter((booking) =>
    ["CONFIRMED", "ACTIVE", "COMPLETED"].includes(booking.status)
  );

  const isBookingInSlot = (booking: IBooking, day: Date, timeSlot: string) => {
    const bookingDate = new Date(booking.date);
    const bookingStartTime = new Date(booking.startTime);
    const bookingEndTime = new Date(booking.endTime);

    const dayMatch = bookingDate.toDateString() === day.toDateString();
    const timeSlotStart = parseInt(timeSlot.split(":")[0], 10);
    const timeSlotEnd = timeSlotStart + 1;

    const timeMatch =
      bookingStartTime.getHours() < timeSlotEnd &&
      bookingEndTime.getHours() > timeSlotStart;

    return dayMatch && timeMatch;
  };

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    hoverColor: string
  ) => {
    e.currentTarget.style.backgroundColor = hoverColor;
  };

  const handleMouseLeave = (
    e: React.MouseEvent<HTMLDivElement>,
    baseColor: string
  ) => {
    e.currentTarget.style.backgroundColor = baseColor;
  };

  const handleNextDay = () => {
    if (currentDayIndex < weekDays.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    }
  };

  const handlePrevDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    }
  };

  return (
    <div className="mt-8 flex relative">
      <div className="w-full">
        <Header weekDays={weekDays} />
        {/* Layout para telas acima de md */}
        <div
          className="hidden md:grid gap-1 relative"
          style={{
            gridTemplateColumns: "repeat(7, 1fr)",
            gridTemplateRows: `repeat(${DEFAULT_TIME_SLOTS.length}, minmax(96px, auto))`,
          }}
        >
          {DEFAULT_TIME_SLOTS.map((timeSlot, rowIndex) =>
            weekDays.map((day, colIndex) => {
              const bookingsInSlot = filteredBookings.filter((booking) =>
                isBookingInSlot(booking, day, timeSlot.split("\n")[0])
              );

              const now = new Date();
              const isCurrentTime =
                day.toDateString() === now.toDateString() &&
                parseInt(timeSlot.split(":")[0], 10) === now.getHours();

              return (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`shadow-sm rounded relative flex flex-wrap items-start gap-1 p-1
                ${isCurrentTime ? "bg-[rgba(23,23,23,0.1)]" : "bg-white"} 
                ${colIndex === 0 ? "border-l" : ""}`}
                >
                  {colIndex === 0 && (
                    <span className="text-sm font-medium absolute flex h-full top-0 items-center -left-14 text-gray-600 whitespace-pre-wrap">
                      {timeSlot}
                    </span>
                  )}
                  {bookingsInSlot.map((booking) => (
                    <Dialog key={booking.id}>
                      <DialogTrigger className="w-full text-left">
                        <div
                          style={{
                            backgroundColor: attributeColorToRoom(
                              booking.roomId
                            ).color,
                          }}
                          onMouseEnter={(e) =>
                            handleMouseEnter(
                              e,
                              attributeColorToRoom(booking.roomId).hoverColor
                            )
                          }
                          onMouseLeave={(e) =>
                            handleMouseLeave(
                              e,
                              attributeColorToRoom(booking.roomId).color
                            )
                          }
                          className="text-xs p-1 px-2 rounded shadow-sm flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div>
                            <strong>{booking.room.name}</strong>
                            <p>{booking.user.name}</p>
                          </div>
                          <ZoomInIcon size={16} />
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-2xl">
                            Detalhes do Agendamento
                          </DialogTitle>
                        </DialogHeader>
                        <Separator />
                        <DialogDescription className="text-black grid grid-cols-1 grid-row-3 gap-4">
                          <div className="grid grid-cols-3 items-center justify-between">
                            <div className="flex flex-col">
                              <strong>Usuário</strong> {booking.user.name}
                            </div>
                            <div className="flex flex-col">
                              <strong>Sala</strong> {booking.room.name}
                            </div>
                            <div className="flex flex-col">
                              <strong>Data</strong>{" "}
                              {new Date(booking.date).toLocaleDateString(
                                "pt-BR"
                              )}
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
                  ))}
                </div>
              );
            })
          )}
        </div>
        {/* Layout para telas abaixo de md */}
        <div className="md:hidden flex flex-col items-end md:items-center gap-4">
          <div className="flex justify-between items-center w-full">
            <button
              onClick={handlePrevDay}
              disabled={currentDayIndex === 0}
              className="p-2 rounded bg-white disabled:opacity-50"
            >
              <ChevronLeft />
            </button>
            <span className="font-medium">
              {weekDays[currentDayIndex].toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
              })}
            </span>
            <button
              onClick={handleNextDay}
              disabled={currentDayIndex === weekDays.length - 1}
              className="p-2 rounded bg-white disabled:opacity-50"
            >
              <ChevronRight />
            </button>
          </div>
          <div
            className="grid gap-1 max-w-full w-10/12"
            style={{
              gridTemplateRows: `repeat(${DEFAULT_TIME_SLOTS.length}, minmax(96px, auto))`,
            }}
          >
            {DEFAULT_TIME_SLOTS.map((timeSlot, rowIndex) => {
              const day = weekDays[currentDayIndex];
              const bookingsInSlot = filteredBookings.filter((booking) =>
                isBookingInSlot(booking, day, timeSlot.split("\n")[0])
              );

              return (
                <div
                  key={`cell-${rowIndex}`}
                  className={
                    "shadow-sm rounded relative flex flex-wrap items-start gap-1 p-1 bg-white w-full"
                  }
                >
                  <span className="text-sm font-medium absolute flex h-full top-0 items-center -left-14 text-gray-600 whitespace-pre-wrap">
                    {timeSlot}
                  </span>
                  {bookingsInSlot.map((booking) => (
                    <Dialog key={booking.id}>
                      <DialogTrigger className="w-full text-left">
                        <div
                          style={{
                            backgroundColor: attributeColorToRoom(
                              booking.roomId
                            ).color,
                          }}
                          onMouseEnter={(e) =>
                            handleMouseEnter(
                              e,
                              attributeColorToRoom(booking.roomId).hoverColor
                            )
                          }
                          onMouseLeave={(e) =>
                            handleMouseLeave(
                              e,
                              attributeColorToRoom(booking.roomId).color
                            )
                          }
                          className="text-xs p-1 px-2 rounded shadow-sm flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div>
                            <strong>{booking.room.name}</strong>
                            <p>{booking.user.name}</p>
                          </div>
                          <ZoomInIcon size={16} />
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-2xl">
                            Detalhes do Agendamento
                          </DialogTitle>
                        </DialogHeader>
                        <Separator />
                        <DialogDescription className="text-black grid grid-cols-1 grid-row-3 gap-4">
                          {/* Conteúdo do Dialog */}
                        </DialogDescription>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
