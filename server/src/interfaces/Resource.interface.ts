export interface IResource {
  id: number;
  name: string;
  quantity: number;
  roomId: number;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResourceDTO {
  name: string;
  quantity: number;
  roomId: number;
  description?: string;
}

export interface IResourceRepository {
  listResources(): Promise<IResource[]>;
  findResourceById(resourceId: number): Promise<IResource | null>;
  createResource(data: IResourceDTO): Promise<IResource>;
  updateResource(id: number, data: IResourceDTO): Promise<IResource>;
  deleteResource(id: number): Promise<IResource>;
}
