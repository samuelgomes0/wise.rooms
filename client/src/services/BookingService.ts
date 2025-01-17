import { IBooking } from "@/types";
import apiServiceInstance from "./ApiService";

interface BookingData {
  userId: string;
  roomId: number;
  date: Date | string;
  startTime: Date | string;
  endTime: Date | string;
  description?: string;
}

class BookingService {
  async listBookings(): Promise<IBooking[]> {
    const bookings = await apiServiceInstance.get<IBooking[]>("/bookings");
    return bookings.data;
  }

  async findBookingsByUser(userId: string): Promise<IBooking[]> {
    const bookings = await apiServiceInstance.get<IBooking[]>(
      `/bookings/user/${userId}`
    );
    return bookings.data;
  }

  async createBooking({
    userId,
    roomId,
    date,
    startTime,
    endTime,
    description,
  }: BookingData) {
    return await apiServiceInstance.post<void, BookingData>("/bookings", {
      userId,
      roomId,
      date,
      startTime,
      endTime,
      description,
    });
  }

  async updateBooking({
    bookingId,
    userId,
    roomId,
    date,
    startTime,
    endTime,
    description,
  }: BookingData & { bookingId: string }) {
    return await apiServiceInstance.put<void, BookingData>(
      `/bookings/${bookingId}`,
      {
        userId,
        roomId,
        date,
        startTime,
        endTime,
        description,
      }
    );
  }

  async cancelBooking(bookingId: string) {
    return await apiServiceInstance.put(`/bookings/${bookingId}/cancel`);
  }

  async completeBooking(bookingId: string) {
    return await apiServiceInstance.put(`/bookings/${bookingId}/complete`);
  }
}

const bookingServiceInstance = new BookingService();
export default bookingServiceInstance;
