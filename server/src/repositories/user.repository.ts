import { prisma } from "../database/prisma-client";
import { IUser, IUserCreateDTO, IUserRepository } from "../interfaces";

const userSelect = {
  id: true,
  name: true,
  email: true,
  password: true,
  createdAt: true,
  role: {
    select: {
      id: true,
      name: true,
    },
  },
  bookings: {
    select: {
      id: true,
      room: {
        select: {
          id: true,
          name: true,
        },
      },
      date: true,
      startTime: true,
      endTime: true,
      status: true,
      description: true,
    },
  },
  AuditLog: true,
};

export class UserRepository implements IUserRepository {
  async listUsers(): Promise<IUser[]> {
    return await prisma.user.findMany({
      select: userSelect,
    });
  }

  async findById(id: string): Promise<IUser | null> {
    return await prisma.user.findUnique({
      where: {
        id,
      },
      select: userSelect,
    });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await prisma.user.findUnique({
      where: {
        email,
      },
      select: userSelect,
    });
  }

  async createUser({
    name,
    email,
    password,
    roleId,
  }: IUserCreateDTO): Promise<IUser> {
    return await prisma.user.create({
      data: {
        name,
        email,
        password,
        roleId,
      },
      select: userSelect,
    });
  }

  async updateUser({
    name,
    email,
    password,
    roleId,
  }: IUserCreateDTO): Promise<IUser> {
    return await prisma.user.update({
      where: {
        email,
      },
      data: {
        name,
        email,
        password,
        roleId,
      },
      select: userSelect,
    });
  }

  async deleteUser(id: string): Promise<IUser> {
    return await prisma.user.delete({
      where: {
        id,
      },
      select: userSelect,
    });
  }
}
