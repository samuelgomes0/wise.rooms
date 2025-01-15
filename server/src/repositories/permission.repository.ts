import { PermissionName, RoleName } from "@prisma/client";
import { prisma } from "../database/prisma-client";
import {
  IPermission,
  IPermissionRepository,
} from "../interfaces/Permission.interface";

class PermissionRepository implements IPermissionRepository {
  async listPermissions(): Promise<IPermission[]> {
    const permissions = await prisma.permission.findMany({
      select: {
        id: true,
        name: true,
        roles: {
          select: {
            name: true,
          },
        },
      },
    });

    return permissions;
  }

  async createPermission(name: PermissionName) {
    await prisma.permission.create({
      data: {
        name,
      },
      include: {
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async assignPermissionToRole(permissionId: number, roleId: number) {
    await prisma.permission.update({
      where: {
        id: permissionId,
      },
      data: {
        roles: {
          connect: {
            id: roleId,
          },
        },
      },
    });
  }

  async createAllPermissions() {
    const allPermissions: PermissionName[] = [
      PermissionName.CREATE_USER,
      PermissionName.READ_USER,
      PermissionName.UPDATE_USER,
      PermissionName.DELETE_USER,
      PermissionName.CREATE_ROLE,
      PermissionName.READ_ROLE,
      PermissionName.UPDATE_ROLE,
      PermissionName.DELETE_ROLE,
      PermissionName.ASSIGN_ROLE,
      PermissionName.CREATE_ROOM,
      PermissionName.READ_ROOM,
      PermissionName.UPDATE_ROOM,
      PermissionName.DELETE_ROOM,
      PermissionName.CREATE_RESOURCE,
      PermissionName.READ_RESOURCE,
      PermissionName.UPDATE_RESOURCE,
      PermissionName.DELETE_RESOURCE,
      PermissionName.CREATE_BOOKING,
      PermissionName.READ_BOOKING,
      PermissionName.UPDATE_BOOKING,
      PermissionName.CANCEL_BOOKING,
      PermissionName.CONFIRM_BOOKING,
      PermissionName.VIEW_AUDIT_LOGS,
      PermissionName.MANAGE_PERMISSIONS,
      PermissionName.ACCESS_SYSTEM_SETTINGS,
    ];

    for (const permission of allPermissions) {
      const existingPermission = await prisma.permission.findFirst({
        where: { name: permission },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: { name: permission },
        });
      }
    }
  }

  async assignPermissionsToRoles() {
    // Define the mapping of permissions to roles
    const permissionsToRoles: {
      permission: PermissionName;
      roles: RoleName[];
    }[] = [
      {
        permission: PermissionName.CREATE_USER,
        roles: [RoleName.ADMIN, RoleName.SUPERVISOR],
      },
      {
        permission: PermissionName.READ_USER,
        roles: [RoleName.ADMIN, RoleName.SUPERVISOR],
      },
      {
        permission: PermissionName.UPDATE_USER,
        roles: [RoleName.ADMIN, RoleName.SUPERVISOR],
      },
      { permission: PermissionName.DELETE_USER, roles: [RoleName.ADMIN] },
      {
        permission: PermissionName.CREATE_ROLE,
        roles: [RoleName.ADMIN, RoleName.SUPERVISOR],
      },
      // Adicione os mapeamentos restantes aqui...
    ];

    for (const mapping of permissionsToRoles) {
      // Busca a permissão pelo nome
      const permission = await prisma.permission.findFirst({
        where: { name: mapping.permission },
      });

      if (permission) {
        for (const roleName of mapping.roles) {
          // Busca o cargo pelo nome
          const role = await prisma.role.findFirst({
            where: { name: roleName },
          });

          if (role) {
            // Associa a permissão ao cargo
            await prisma.permission.update({
              where: { id: permission.id },
              data: {
                roles: {
                  connect: { id: role.id },
                },
              },
            });
          } else {
            console.error(`Role ${roleName} not found`);
          }
        }
      } else {
        console.error(`Permission ${mapping.permission} not found`);
      }
    }
  }
}

export default PermissionRepository;
