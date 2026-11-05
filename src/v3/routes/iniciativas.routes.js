import { Router } from "express";
import * as controller from "../controllers/iniciativas.controller.js";

const router = Router();

router.get("/", controller.listar);
router.get("/buscar", controller.buscarPorCategoria);
router.get("/:id", controller.obtenerPorId);
router.post("/", controller.crear);
router.put("/:id", controller.actualizar);
router.patch("/:id/desactivar", controller.desactivar);
router.delete("/:id", controller.eliminar);

export default router;
