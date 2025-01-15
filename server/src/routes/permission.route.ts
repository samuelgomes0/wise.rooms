import { Router } from "express";
import PermissionRepository from "../repositories/permission.repository";

const router = Router();

const permissionRepository = new PermissionRepository();

// GET /permissions
router.get("/", async (req, res) => {
  const permissions = await permissionRepository.listPermissions();

  res.json(permissions);
});

// router.get("/assign-permissions", async (req, res) => {
//   await permissionRepository.assignPermissionsToRoles();

//   res.json({ message: "Permissions assigned to roles" });
// });

// router.get("/create-permissions", async (req, res) => {
//   await permissionRepository.createAllPermissions();

//   res.json({ message: "Permissions created" });
// });

export default router;
