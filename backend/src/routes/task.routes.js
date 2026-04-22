import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} from "../controllers/task.controller.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  authorizeRoles("admin"),   // ONLY ADMIN
  createTask
);

router.get(
  "/",
  verifyJWT,                 // BOTH USER + ADMIN
  getTasks
);

router.patch(
  "/:id",
  verifyJWT,
  authorizeRoles("admin"),    // OPTIONAL: restrict update
  updateTask
);

router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles("admin"),    // ONLY ADMIN
  deleteTask
);

export default router;
