import { IAuditLog } from "./AuditLog.interface";
import { IBooking } from "./Booking.interface";

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  roleId: number;
  bookings?: IBooking[];
  auditLog?: IAuditLog[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreateDTO {
  name: string;
  email: string;
  password: string;
}

export interface IUserRepository {
  getAll(): Promise<IUser[]>;
  findByEmail(email: string): Promise<IUser | null>;
  findByName(name: string): Promise<IUser | null>;
  create(user: IUserCreateDTO): Promise<IUser>;
  update(user: IUserCreateDTO): Promise<IUser>;
  delete(id: string): Promise<IUser>;
}
