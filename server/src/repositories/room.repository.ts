import { prisma } from "../database/prisma-client";
import { IRoom, IRoomCreateDTO, IRoomRepository } from "../interfaces";

export class RoomRepository implements IRoomRepository {
  async listRooms(): Promise<IRoom[]> {
    return await prisma.room.findMany({
      include: {
        resources: true,
      },
    });
  }

  async findRoomById(roomId: number): Promise<IRoom | null> {
    return await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });
  }

  async createRoom(room: IRoomCreateDTO): Promise<IRoom> {
    return await prisma.room.create({
      data: room,
    });
  }

  async updateRoom(roomId: number, room: IRoomCreateDTO): Promise<IRoom> {
    return await prisma.room.update({
      where: {
        id: roomId,
      },
      data: room,
    });
  }

  async deleteRoom(roomId: number): Promise<void> {
    await prisma.room.delete({
      where: {
        id: roomId,
      },
    });
  }
}
