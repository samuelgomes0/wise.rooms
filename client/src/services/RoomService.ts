import { IRoom } from "@/types";
import apiServiceInstance from "./ApiService";

interface RoomData {
  name: string;
  capacity: number;
  description?: string;
}

class RoomService {
  async listRooms() {
    const { data } = await apiServiceInstance.get<IRoom[]>("/rooms");
    return data;
  }

  async createRoom({ name, capacity, description }: RoomData) {
    return await apiServiceInstance.post("/rooms", {
      name,
      capacity,
      description,
    });
  }

  async deleteRoom(roomId: number) {
    return await apiServiceInstance.delete(`/rooms/${roomId}`);
  }
}

const roomServiceInstance = new RoomService();
export default roomServiceInstance;
