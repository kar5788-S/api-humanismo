import { Router } from "express";
import * as controller from "../controllers/categorias.controller.js";

const router = Router();

router.get("/", controller.listar);
router.get("/:id", controller.obtenerPorId);
router.post("/", controller.crear);
router.put("/:id", controller.actualizar);
router.patch("/:id/desactivar", controller.desactivar);
router.delete("/:id", controller.eliminar);

export default router;
