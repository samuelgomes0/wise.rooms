import { AuditAction, AuditEntity } from "@prisma/client";
import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { AuditLogRepository, ResourceRepository } from "../repositories";
import { AuditLogUseCase, ResourceUseCase } from "../usecases";

const router = Router();
const resourceRepository = new ResourceRepository();
const resourceUseCase = new ResourceUseCase(resourceRepository);

const auditLogRepository = new AuditLogRepository();
const auditLogUseCase = new AuditLogUseCase(auditLogRepository);

// GET /resources
router.get("/", async (req, res) => {
  try {
    const resources = await resourceUseCase.listResources();

    return res.status(200).json(resources);
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    });
  }
});

// POST /resources
router.post("/", isAuthenticated, async (req: any, res) => {
  const { name, quantity, roomId, description } = req.body;

  try {
    const resource = await resourceUseCase.createResource({
      name,
      quantity,
      roomId,
      description,
    });

    const { id: performedBy } = req.user;

    await auditLogUseCase.createAuditLog({
      userId: performedBy,
      action: AuditAction.CREATE,
      entity: AuditEntity.RESOURCE,
      entityId: String(resource.id),
    });

    return res.status(201).json({ message: "Resource created." });
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    });
  }
});

// DELETE /resources/:id
router.delete("/:id", isAuthenticated, async (request: any, reply) => {
  const id = request.params.id;

  try {
    await resourceUseCase.deleteResource(parseInt(id));

    const { id: performedBy } = request.user;

    await auditLogUseCase.createAuditLog({
      userId: performedBy,
      action: AuditAction.DELETE,
      entity: AuditEntity.RESOURCE,
      entityId: String(id),
    });

    return reply.status(200).json({ message: "Resource deleted." });
  } catch (error) {
    return reply.status(400).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    });
  }
});

export default router;
