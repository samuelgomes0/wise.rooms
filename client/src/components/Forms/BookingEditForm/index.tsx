"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Textarea } from "@/components/ui/textarea";
import { Notification, SEPARATED_DEFAULT_TIME_SLOTS } from "@/constants";
import { LoadingContext } from "@/contexts/LoadingContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { registerBookingSchema } from "@/schemas";
import bookingServiceInstance from "@/services/BookingService";
import roomServiceInstance from "@/services/RoomService";
import { ApiError, IBooking } from "@/types";
import { IRoom } from "@/types/Room.interface";
import { errorHandler } from "@/utils";
import { useContext, useEffect, useState } from "react";

function BookingEditForm({
  booking,
  onCloseModal,
  onBookingUpdated,
}: {
  booking: IBooking;
  onCloseModal: () => void;
  onBookingUpdated: () => void;
}) {
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [startTime, setStartTime] = useState<Date | string>(booking.startTime);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof registerBookingSchema>>({
    resolver: zodResolver(registerBookingSchema),
    defaultValues: {
      user: booking.userId.toString(),
      room: booking.room.id.toString(),
      date: new Date(booking.date),
      startTime: booking.startTime,
      endTime: booking.endTime,
      description: booking.description || "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerBookingSchema>) {
    const dateISO = values.date.toISOString().split("T")[0];
    const timeStartDate = new Date(`${dateISO}T${values.startTime}:00`);
    const timeEndDate = new Date(`${dateISO}T${values.endTime}:00`);

    try {
      setIsLoading(true);

      await bookingServiceInstance.updateBooking({
        bookingId: booking.id,
        userId: values.user,
        roomId: parseInt(values.room),
        date: dateISO,
        startTime: timeStartDate,
        endTime: timeEndDate,
        description: values.description,
      });

      onCloseModal();
      onBookingUpdated();

      toast({
        variant: "default",
        title: Notification.SUCCESS.BOOKING.UPDATE_TITLE,
        description: Notification.SUCCESS.BOOKING.UPDATE_DESCRIPTION,
      });
    } catch (error) {
      const { title, description } = errorHandler(error as ApiError);

      toast({ variant: "destructive", title, description });
    } finally {
      setIsLoading(false);
    }
  }

  const listRoomsAndUsers = async () => {
    const rooms = await roomServiceInstance.listRooms();
    setRooms(rooms);
  };

  useEffect(() => {
    listRoomsAndUsers();
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (data) => {
            onSubmit(data);
          },
          (errors) => {
            console.log("Erros de validação:", errors);
          }
        )}
        className="flex flex-col gap-4 w-full"
      >
        <FormField
          control={form.control}
          name="room"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Sala</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma sala" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id.toString()}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data da Reserva</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ptBR })
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                      <CalendarIcon className="ml-auto opacity-50" size={18} />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      const today = new Date();
                      const oneMonthAhead = new Date(today);
                      oneMonthAhead.setMonth(today.getMonth() + 1);

                      return date < today || date > oneMonthAhead;
                    }}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Horário de Início</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setStartTime(value);
                  }}
                  defaultValue={
                    typeof field.value === "string" ? field.value : ""
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SEPARATED_DEFAULT_TIME_SLOTS.map((timeSlot) => (
                      <SelectItem key={timeSlot} value={timeSlot}>
                        {timeSlot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Horário de Fim</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={
                    typeof field.value === "string" ? field.value : ""
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SEPARATED_DEFAULT_TIME_SLOTS.filter(
                      (timeSlot) => !startTime || timeSlot > startTime
                    ).map((timeSlot) => (
                      <SelectItem key={timeSlot} value={timeSlot}>
                        {timeSlot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Adicione uma descrição para a reserva (opcional)"
                    className="textarea-class w-full h-20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Spinner size="small" /> : "Salvar Alterações"}
        </Button>
      </form>
    </Form>
  );
}

export default BookingEditForm;
