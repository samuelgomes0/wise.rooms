import { BookingStatus } from "@prisma/client";

export interface IBooking {
  id: string;
  userId: string;
  roomId: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookingCreateDTO {
  userId: string;
  roomId: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  description?: string | null;
}

export interface IBookingRepository {
  listBookings(): Promise<IBooking[]>;
  findBookingById(bookingId: string): Promise<IBooking | null>;
  findBookingByUser(userId: string): Promise<IBooking[]>;
  createBooking(booking: IBookingCreateDTO): Promise<IBooking>;
  updateBooking(
    bookingId: string,
    booking: IBookingCreateDTO
  ): Promise<IBooking>;
  deleteBooking(bookingId: string): Promise<IBooking>;
  updateBookingStatus(
    bookingId: string,
    status: BookingStatus
  ): Promise<IBooking>;
  checkAndUpdateBookingStatuses(): Promise<void>;
}
