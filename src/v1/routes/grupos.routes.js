import { Router } from "express";
import * as gruposController from "../controllers/grupos.controller.js";

const router = Router();

router.get("/", gruposController.listar);
router.get("/:id", gruposController.obtenerPorId);
router.post("/", gruposController.crear);
router.put("/:id", gruposController.actualizar);
router.patch("/:id/desactivar", gruposController.desactivar);
router.delete("/:id", gruposController.eliminar);

export default router;
