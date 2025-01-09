"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Notification } from "@/constants";
import { LoadingContext } from "@/contexts/LoadingContext";
import { useToast } from "@/hooks/use-toast";
import { createResourceSchema } from "@/schemas";
import resourceServiceInstance from "@/services/ResourceService";
import roomServiceInstance from "@/services/RoomService";
import { ApiError, IRoom } from "@/types";
import { errorHandler } from "@/utils";
import { useContext, useEffect, useState } from "react";

export function ResourceRegistrationForm({
  onCloseModal,
}: {
  onCloseModal: () => void;
}) {
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [rooms, setRooms] = useState<IRoom[]>([]);

  const form = useForm<z.infer<typeof createResourceSchema>>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: {
      name: "",
      quantity: 0,
      roomId: "",
      description: "",
    },
  });

  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof createResourceSchema>) => {
    try {
      setIsLoading(true);

      await resourceServiceInstance.createResource({
        name: values.name,
        quantity: values.quantity,
        roomId: Number(values.roomId),
        description: values.description,
      });
      onCloseModal();
      toast({
        title: Notification.SUCCESS.RESOURCE.CREATE_TITLE,
        description: Notification.SUCCESS.RESOURCE.CREATE_DESCRIPTION,
      });
    } catch (error) {
      const { title, description } = errorHandler(error as ApiError);

      toast({ variant: "destructive", title, description });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    roomServiceInstance.listRooms().then((data) => {
      setRooms(data);
    });
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do recurso" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Quantidade disponível"
                  {...field}
                  onChange={({ target }) => {
                    field.onChange(parseInt(target.value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roomId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sala Alocada</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma sala" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id.toString()}>
                      {room.name}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrição do recurso (opcional)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Spinner size="small" /> : "Cadastrar Recurso"}
        </Button>
      </form>
    </Form>
  );
}
