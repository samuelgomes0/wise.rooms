// src/routes/rooms.ts
import { AuditAction, AuditEntity } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { ApiError } from "../interfaces";
import { AuditLogRepository } from "../repositories";
import { RoleRepository } from "../repositories/role.repository";
import { AuditLogUseCase, RoleUseCase } from "../usecases";

const router = Router();
const roleRepository = new RoleRepository();
const roleUseCase = new RoleUseCase(roleRepository);

const auditLogRepository = new AuditLogRepository();
const auditLogUseCase = new AuditLogUseCase(auditLogRepository);

// GET /roles
router.get("/", async (request, reply) => {
  try {
    const roles = await roleUseCase.listRoles();
    return reply.status(200).send(roles);
  } catch (error) {
    const { code, message, statusCode } = error as ApiError;
    return reply.status(statusCode).send({ code, message, statusCode });
  }
});

// POST /roles
router.post("/", async (request: any, reply) => {
  const createRoleSchema = z.object({
    name: z.string(),
  });

  const { name } = createRoleSchema.parse(request.body);

  try {
    const role = await roleUseCase.createRole(name);

    const { id: performedBy } = request.user;

    if (!performedBy) {
      await auditLogUseCase.createAuditLog({
        userId: performedBy,
        action: AuditAction.CREATE,
        entity: AuditEntity.ROLE,
        entityId: String(role.id),
      });
    }

    return reply.status(201).send({ success: true });
  } catch (error) {
    const { code, message, statusCode } = error as ApiError;
    return reply.status(statusCode).send({ code, message, statusCode });
  }
});

export default router;
