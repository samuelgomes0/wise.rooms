import { BookingStatus } from "@prisma/client";
import { prisma } from "../database/prisma-client";
import { IBooking, IBookingCreateDTO, IBookingRepository } from "../interfaces";

export class BookingRepository implements IBookingRepository {
  async listBookings(): Promise<IBooking[]> {
    await this.checkAndUpdateBookingStatuses();
    return await prisma.booking.findMany({
      include: {
        user: true,
        room: true,
      },
    });
  }

  async findBookingById(bookingId: string): Promise<IBooking | null> {
    await this.checkAndUpdateBookingStatuses();
    return await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });
  }

  async findBookingByUser(userId: string): Promise<IBooking[]> {
    return await prisma.booking.findMany({
      where: {
        userId,
      },
      include: {
        room: true,
      },
    });
  }

  async createBooking({
    userId,
    roomId,
    date,
    startTime,
    endTime,
    description,
  }: IBookingCreateDTO): Promise<IBooking> {
    return await prisma.booking.create({
      data: {
        userId,
        roomId,
        date,
        startTime,
        endTime,
        description,
      },
    });
  }

  async checkConflict(
    roomId: number,
    date: Date,
    startTime: Date,
    endTime: Date
  ): Promise<boolean> {
    const conflict = await prisma.booking.findFirst({
      where: {
        roomId,
        date,
        status: {
          not: BookingStatus.CANCELLED,
        },
        OR: [
          {
            startTime: {
              lt: endTime,
            },
            endTime: {
              gt: startTime,
            },
          },
        ],
      },
    });

    return !!conflict;
  }

  async updateBooking(
    bookingId: string,
    { userId, roomId, date, startTime, endTime, description }: IBookingCreateDTO
  ): Promise<IBooking> {
    return await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        userId,
        roomId,
        date,
        startTime,
        endTime,
        description,
      },
    });
  }

  async deleteBooking(bookingId: string): Promise<IBooking> {
    return await prisma.booking.delete({
      where: {
        id: bookingId,
      },
    });
  }

  async updateBookingStatus(
    bookingId: string,
    status: BookingStatus
  ): Promise<IBooking> {
    return await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status,
      },
    });
  }

  async checkAndUpdateBookingStatuses(): Promise<void> {
    const now = new Date();

    await prisma.booking.updateMany({
      where: {
        startTime: {
          lte: now,
        },
        endTime: {
          gte: now,
        },
        status: "CONFIRMED",
      },
      data: {
        status: "ACTIVE",
      },
    });

    await prisma.booking.updateMany({
      where: {
        endTime: {
          lt: now,
        },
        status: {
          in: ["ACTIVE", "CONFIRMED"],
        },
      },
      data: {
        status: "COMPLETED",
      },
    });
  }
}
