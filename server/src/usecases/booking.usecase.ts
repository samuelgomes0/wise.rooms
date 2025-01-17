import { IBooking, IBookingCreateDTO } from "../interfaces/Booking.interface";
import { BookingRepository } from "../repositories";
import AppError from "../utils/errorHandling";

export class BookingUseCase {
  private bookingRepository: BookingRepository;

  constructor(bookingRepository: BookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  async listBookings(): Promise<IBooking[]> {
    return this.bookingRepository.listBookings();
  }

  async findBookingById(bookingId: string): Promise<IBooking | null> {
    return this.bookingRepository.findBookingById(bookingId);
  }

  async findBookingByUser(userId: string): Promise<IBooking[]> {
    return this.bookingRepository.findBookingByUser(userId);
  }

  async createBooking({
    userId,
    roomId,
    date,
    startTime,
    endTime,
    description,
  }: IBookingCreateDTO): Promise<IBooking> {
    const hasConflict = await this.bookingRepository.checkConflict(
      roomId,
      date,
      startTime,
      endTime
    );

    if (hasConflict) {
      throw new AppError(
        "BOOKING_CONFLICT",
        "There is a conflict with another booking.",
        400
      );
    }

    const booking = await this.bookingRepository.createBooking({
      userId,
      roomId,
      date,
      startTime,
      endTime,
      description,
    });

    this.bookingRepository.updateBookingStatus(booking.id, "CONFIRMED");

    return booking;
  }

  async updateBooking(
    bookingId: string,
    booking: IBookingCreateDTO
  ): Promise<IBooking> {
    return this.bookingRepository.updateBooking(bookingId, booking);
  }

  async deleteBooking(bookingId: string): Promise<IBooking> {
    return this.bookingRepository.deleteBooking(bookingId);
  }

  async cancelBooking(bookingId: string, userId: string): Promise<IBooking> {
    const booking = await this.bookingRepository.findBookingById(bookingId);

    if (!booking)
      throw new AppError("BOOKING_NOT_FOUND", "Booking not found.", 404);

    if (booking.userId !== userId)
      throw new AppError(
        "UNAUTHORIZED",
        "You are not authorized to cancel this booking.",
        403
      );

    if (booking.status === "CANCELLED")
      throw new AppError(
        "BOOKING_ALREADY_CANCELLED",
        "Booking already cancelled.",
        400
      );

    const now = new Date();
    if (booking.date < now)
      throw new AppError(
        "BOOKING_PAST_DATE",
        "Cannot cancel past bookings.",
        400
      );

    if (booking.status !== "PENDING" && booking.status !== "CONFIRMED")
      throw new AppError(
        "BOOKING_CANNOT_CANCEL",
        "Booking cannot be cancelled.",
        400
      );

    return this.bookingRepository.updateBookingStatus(bookingId, "CANCELLED");
  }

  async completeBooking(bookingId: string, userId: string): Promise<IBooking> {
    const booking = await this.bookingRepository.findBookingById(bookingId);

    if (!booking)
      throw new AppError("BOOKING_NOT_FOUND", "Booking not found.", 404);

    if (booking.userId !== userId)
      throw new AppError(
        "UNAUTHORIZED",
        "You are not authorized to complete this booking.",
        403
      );

    if (booking.status === "COMPLETED")
      throw new AppError(
        "BOOKING_ALREADY_COMPLETED",
        "Booking already completed.",
        400
      );

    if (booking.status === "CANCELLED")
      throw new AppError(
        "BOOKING_ALREADY_CANCELLED",
        "Booking already cancelled.",
        400
      );

    return this.bookingRepository.updateBookingStatus(bookingId, "COMPLETED");
  }
}
